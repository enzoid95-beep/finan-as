-- Planejamento Financeiro · atualização v4
-- Cartões e parcelamentos, recorrentes, dívidas, desejos, orçamento mensal,
-- reserva de emergência e dinheiro livre de cada um.
-- Rode UMA vez no SQL Editor do Supabase (depois do v2 e do v3). Não apaga nada.

create table if not exists public.cartoes (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null check (char_length(nome) between 1 and 40),
  limite     numeric(12,2) not null default 0 check (limite >= 0),
  fechamento int not null check (fechamento between 1 and 31),
  vencimento int not null check (vencimento between 1 and 31),
  cor        text not null default '#7c3aed',
  criado_em  timestamptz not null default now()
);

create table if not exists public.recorrentes (
  id         uuid primary key default gen_random_uuid(),
  tipo       text not null check (tipo in ('gasto','entrada')),
  descricao  text not null check (char_length(descricao) between 1 and 80),
  categoria  text not null,
  valor      numeric(12,2) not null check (valor > 0),
  dia        int not null check (dia between 1 and 31),
  ativa      boolean not null default true,
  inicio     text not null,          -- mês em que começa, formato AAAA-MM
  ultimo_mes text,                   -- último mês já lançado
  criado_em  timestamptz not null default now()
);

create table if not exists public.dividas (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null check (char_length(nome) between 1 and 60),
  credor         text not null default '',
  parcela        numeric(12,2) not null check (parcela > 0),
  parcelas_total int not null check (parcelas_total > 0),
  pagas_inicial  int not null default 0 check (pagas_inicial >= 0),
  dia            int not null check (dia between 1 and 31),
  juros          numeric(6,3) not null default 0,
  criado_em      timestamptz not null default now()
);

create table if not exists public.desejos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null check (char_length(nome) between 1 and 60),
  emoji      text not null default '✨',
  valor      numeric(12,2) not null check (valor > 0),
  prioridade int not null default 2 check (prioridade between 1 and 3),
  link       text not null default '',
  status     text not null default 'aberto' check (status in ('aberto','meta','comprado')),
  criado_em  timestamptz not null default now()
);

create table if not exists public.orcamentos (
  mes           text primary key,    -- AAAA-MM
  gastos        jsonb not null default '{}'::jsonb,
  entradas      numeric(12,2) not null default 0,
  atualizado_em timestamptz not null default now()
);

alter table public.metas  add column if not exists reserva boolean not null default false;
alter table public.config add column if not exists mesadas jsonb not null default '{}'::jsonb;

alter table public.lancamentos add column if not exists cartao_id     uuid references public.cartoes(id) on delete set null;
alter table public.lancamentos add column if not exists compra_id     uuid;
alter table public.lancamentos add column if not exists parcela       int;
alter table public.lancamentos add column if not exists parcelas      int;
alter table public.lancamentos add column if not exists recorrente_id uuid references public.recorrentes(id) on delete set null;
alter table public.lancamentos add column if not exists divida_id     uuid references public.dividas(id) on delete set null;
create index if not exists lancamentos_compra_idx on public.lancamentos (compra_id);
create index if not exists lancamentos_cartao_idx on public.lancamentos (cartao_id);

-- Segurança: só membros
do $$
declare t text;
begin
  foreach t in array array['cartoes','recorrentes','dividas','desejos','orcamentos'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "membros usam %s" on public.%I', t, t);
    execute format('create policy "membros usam %s" on public.%I for all to authenticated using (public.eh_membro()) with check (public.eh_membro())', t, t);
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
