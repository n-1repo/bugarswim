create policy membership_packages_select_anon on membership_packages for select to anon
  using (is_active = true);

grant select on membership_packages to anon;
