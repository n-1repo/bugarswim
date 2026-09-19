alter table membership_packages drop constraint membership_packages_billing_cycle_check;
alter table membership_packages drop column billing_cycle;
alter table membership_packages add column sessions_included int;
alter table membership_packages add column validity_weeks int not null default 6;

alter table bookings add column subscription_id uuid references subscriptions(id);

create function create_invoice_for_subscription() returns trigger as $$
declare
  v_price numeric(12, 2);
begin
  select price into v_price from membership_packages where id = new.package_id;
  if v_price is null or v_price = 0 then
    return new;
  end if;
  insert into invoices (child_id, subscription_id, amount, due_date, period_start, period_end)
  values (new.child_id, new.id, v_price, new.start_date, new.start_date, coalesce(new.end_date, new.start_date));
  return new;
end;
$$ language plpgsql;

create trigger subscriptions_create_invoice after insert on subscriptions
  for each row execute function create_invoice_for_subscription();

drop function generate_invoices_for_period(date, date, date);

create view subscription_usage with (security_invoker = true) as
select
  s.id as subscription_id,
  s.child_id,
  s.package_id,
  s.status,
  mp.sessions_included,
  mp.validity_weeks,
  s.start_date,
  s.end_date,
  (select count(*) from bookings b where b.subscription_id = s.id and b.is_attended) as sessions_used,
  case when mp.sessions_included is null then null
    else mp.sessions_included - (select count(*) from bookings b where b.subscription_id = s.id and b.is_attended)
  end as sessions_remaining,
  (s.end_date is not null and s.end_date < current_date) as is_expired
from subscriptions s
join membership_packages mp on mp.id = s.package_id;

grant select on subscription_usage to authenticated;
