create table session_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete restrict,
  amount numeric(12, 2) not null check (amount >= 0),
  paid_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  unique (booking_id)
);

create index session_payments_booking_id_idx on session_payments(booking_id);

alter table cash_ledger add column session_payment_id uuid references session_payments(id);

alter table cash_ledger drop constraint cash_ledger_traceable;

alter table cash_ledger add constraint cash_ledger_traceable check (
  (category = 'payment_received' and direction = 'in' and payroll_run_id is null
    and ((invoice_id is not null and session_payment_id is null)
      or (invoice_id is null and session_payment_id is not null)))
  or (category = 'payroll' and payroll_run_id is not null and invoice_id is null
      and session_payment_id is null and direction = 'out')
  or (category = 'manual_adjustment' and invoice_id is null and payroll_run_id is null
      and session_payment_id is null and reason is not null and length(trim(reason)) > 0)
);

alter table session_payments enable row level security;

create policy session_payments_select on session_payments for select to authenticated
  using (
    is_admin()
    or exists (
      select 1 from bookings b where b.id = session_payments.booking_id
        and (coach_owns_class(b.class_id) or owns_child(b.child_id))
    )
  );
create policy session_payments_write_admin on session_payments for all to authenticated
  using (is_admin()) with check (is_admin());

grant select, insert, update, delete on session_payments to authenticated;
