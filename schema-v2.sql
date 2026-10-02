-- Nosso caixa · atualização v2 (metas e contas fixas)
-- Rode UMA vez no SQL Editor do Supabase. Não apaga nada do que já existe.

-- Metas (casamento, mudança, reserva...)
create table if not exists public.metas (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null check (char_length(nome) between 1 and 60),
  emoji     text not null default '🎯',
  alvo      numeric(12,2) not null check (alvo > 0),
  prazo     date,
  criado_em timestamptz not null default now()
);

-- Contas fixas (aluguel, internet, luz...)
create table if not exists public.contas_fixas (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null check (char_length(nome) between 1 and 60),
  categoria text not null default 'contas',
  valor     numeric(12,2) not null check (valor > 0),
  dia       int not null check (dia between 1 and 31),
  ativa     boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Lançamentos passam a aceitar dinheiro guardado/resgatado de metas
-- e o vínculo com a conta fixa que foi paga
alter table public.lancamentos add column if not exists meta_id  uuid references public.metas(id) on delete cascade;
alter table public.lancamentos add column if not exists conta_id uuid references public.contas_fixas(id) on delete set null;
alter table public.lancamentos drop constraint if exists lancamentos_tipo_check;
alter table public.lancamentos add constraint lancamentos_tipo_check
  check (tipo in ('gasto','entrada','aporte','resgate'));

-- Segurança: só membros
alter table public.metas        enable row level security;
alter table public.contas_fixas enable row level security;

drop policy if exists "membros usam metas" on public.metas;
create policy "membros usam metas" on public.metas
  for all to authenticated using (public.eh_membro()) with check (public.eh_membro());

drop policy if exists "membros usam contas" on public.contas_fixas;
create policy "membros usam contas" on public.contas_fixas
  for all to authenticated using (public.eh_membro()) with check (public.eh_membro());

-- Tempo real
do $$
begin
  begin alter publication supabase_realtime add table public.metas;        exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.contas_fixas; exception when duplicate_object then null; end;
end $$;
