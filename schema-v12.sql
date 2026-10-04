-- v12: data prevista de pagamento de cada fatura do cartão
-- Guarda, por fatura, o dia em que vocês pretendem pagar (pode ser antes do vencimento).
-- Formato: { "<id do cartão>|<mês da fatura>": "AAAA-MM-DD" }
-- Rode uma vez no SQL Editor do Supabase. Pode rodar de novo sem problema.

alter table public.config add column if not exists pag_previstos jsonb not null default '{}'::jsonb;

-- v12 (parte 2): patrimônio inicial
-- Data a partir da qual os investimentos já cadastrados contam no gráfico de Patrimônio
-- (para o cadastro de hoje não aparecer como se fosse crescimento de hoje).
alter table public.config add column if not exists patr_inicial date;
