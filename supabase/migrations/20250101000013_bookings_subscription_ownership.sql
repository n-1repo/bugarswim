drop policy bookings_insert_parent on bookings;

create policy bookings_insert_parent on bookings for insert to authenticated
  with check (
    is_parent()
    and owns_child(child_id)
    and is_attended = false
    and (
      subscription_id is null
      or exists (
        select 1 from subscriptions s
        where s.id = subscription_id and s.child_id = bookings.child_id
      )
    )
  );
