-- Nosso caixa: estrutura do banco no Supabase
-- Rode tudo de uma vez no SQL Editor do Supabase.
-- ANTES, troque os dois e-mails e nomes no final deste arquivo.

-- Quem pode usar o caixa
create table if not exists public.membros (
  email text primary key,
  nome  text not null
);

-- Verifica se quem está logado é um dos membros
create or replace function public.eh_membro()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.membros
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- Lançamentos (gastos e entradas)
create table if not exists public.lancamentos (
  id          uuid primary key default gen_random_uuid(),
  tipo        text not null check (tipo in ('gasto','entrada')),
  valor       numeric(12,2) not null check (valor > 0),
  descricao   text not null default '' check (char_length(descricao) <= 80),
  categoria   text not null,
  data        date not null,
  autor_email text not null default lower(auth.jwt() ->> 'email'),
  criado_em   timestamptz not null default now()
);
create index if not exists lancamentos_data_idx on public.lancamentos (data);

-- Configurações do casal (limites por categoria)
create table if not exists public.config (
  id            text primary key,
  limites       jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);

-- Segurança: só membros leem e escrevem
alter table public.membros     enable row level security;
alter table public.lancamentos enable row level security;
alter table public.config      enable row level security;

drop policy if exists "membros leem membros" on public.membros;
create policy "membros leem membros" on public.membros
  for select to authenticated using (public.eh_membro());

drop policy if exists "membros usam lancamentos" on public.lancamentos;
create policy "membros usam lancamentos" on public.lancamentos
  for all to authenticated using (public.eh_membro()) with check (public.eh_membro());

drop policy if exists "membros usam config" on public.config;
create policy "membros usam config" on public.config
  for all to authenticated using (public.eh_membro()) with check (public.eh_membro());

-- Atualização em tempo real entre os dois celulares
do $$
begin
  begin alter publication supabase_realtime add table public.lancamentos; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.config;      exception when duplicate_object then null; end;
end $$;

-- >>> TROQUE PELOS E-MAILS E NOMES DE VOCÊS <<<
insert into public.membros (email, nome) values
  ('seu.email@exemplo.com',    'Enzo'),
  ('email.dela@exemplo.com',   'Mariana')
on conflict (email) do update set nome = excluded.nome;
