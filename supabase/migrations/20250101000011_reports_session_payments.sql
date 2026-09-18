create or replace view report_revenue with (security_invoker = true) as
select date_trunc('month', paid_at) as month, sum(amount) as revenue
from (
  select paid_at, amount from invoices where status = 'paid'
  union all
  select paid_at, amount from session_payments
) combined
group by 1
order by 1;

create or replace view report_revenue_by_program with (security_invoker = true) as
select package_name, sum(revenue) as revenue
from (
  select mp.name as package_name, i.amount as revenue
  from invoices i
  join subscriptions s on s.id = i.subscription_id
  join membership_packages mp on mp.id = s.package_id
  where i.status = 'paid'
  union all
  select ct.name as package_name, sp.amount as revenue
  from session_payments sp
  join bookings b on b.id = sp.booking_id
  join classes cl on cl.id = b.class_id
  join class_types ct on ct.id = cl.class_type_id
) combined
group by package_name
order by revenue desc;
