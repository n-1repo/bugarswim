update class_types
set name = replace(name, 'Privat', 'Private')
where name like '%Privat%';

update membership_packages
set name = replace(name, 'Privat', 'Private')
where name like '%Privat%';
