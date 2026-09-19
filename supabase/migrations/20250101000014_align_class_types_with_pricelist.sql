update class_types set
  name = 'Privat Class',
  description = '1 member 1 coach, durasi 60 menit. Harga belum termasuk tiket masuk kolam.'
  where id = '1611c8f7-cb99-45db-9c9f-198998edf8cf';

update classes set class_type_id = '1611c8f7-cb99-45db-9c9f-198998edf8cf'
  where class_type_id in (
    '6c06fcc4-011f-4197-be29-6dc82032ba99',
    'b1dc46a1-f9e4-4e22-9bc4-b7db53915016',
    '350ebaf7-40fb-44e1-ace2-4353c06acb93',
    '5f10f52b-983a-46d2-bbe3-7a640ee6f10f',
    'abffd587-93a1-4432-972c-9509a47a5e9a'
  );

delete from class_types where id in (
  '6c06fcc4-011f-4197-be29-6dc82032ba99',
  'b1dc46a1-f9e4-4e22-9bc4-b7db53915016',
  '350ebaf7-40fb-44e1-ace2-4353c06acb93',
  '5f10f52b-983a-46d2-bbe3-7a640ee6f10f',
  'abffd587-93a1-4432-972c-9509a47a5e9a'
);

update class_types set
  name = 'Privat Grup Class',
  description = '2 member 1 coach, durasi 75 menit. Harga belum termasuk tiket masuk kolam.'
  where id = '85143707-dc37-42fa-9a2a-be4c2373ca48';

update classes set class_type_id = '85143707-dc37-42fa-9a2a-be4c2373ca48'
  where class_type_id = '8214e68c-07d2-4927-adb2-7283fc384f9b';

delete from class_types where id = '8214e68c-07d2-4927-adb2-7283fc384f9b';

update class_types set
  name = 'Reguler Class',
  description = '3-5 member 1 coach, durasi 90 menit. Harga belum termasuk tiket masuk kolam.'
  where id = 'cdbbca53-5ce7-4cc9-8191-2f5cfbf289fa';

update classes set class_type_id = 'cdbbca53-5ce7-4cc9-8191-2f5cfbf289fa'
  where class_type_id in (
    '6a191f06-42f6-4dbf-9dce-eed83bddcf9e',
    '4b7a9b9b-7e86-4d58-8cea-032fa434cd3e'
  );

delete from class_types where id in (
  '6a191f06-42f6-4dbf-9dce-eed83bddcf9e',
  '4b7a9b9b-7e86-4d58-8cea-032fa434cd3e'
);

update class_types set
  name = 'Privat Hydrotherapy',
  description = '1 member 1 coach, durasi 60 menit. Untuk anak berkebutuhan khusus, HNP, OA, kelainan tulang belakang, recovery stroke, dll.'
  where id = '442a8f5b-41b9-4ba6-bfe0-ad83d057a9dd';

update classes set class_type_id = '442a8f5b-41b9-4ba6-bfe0-ad83d057a9dd'
  where class_type_id = '94d3a65f-bf4f-42c5-91e4-5fcf23984403';

delete from class_types where id = '94d3a65f-bf4f-42c5-91e4-5fcf23984403';

update class_types set
  name = 'Hydrotherapy Grup',
  description = '2 member 1 coach, durasi 75 menit. Untuk anak berkebutuhan khusus, HNP, OA, kelainan tulang belakang, recovery stroke, dll.'
  where id = '0dd679fb-6437-44f0-a427-0130996293f9';

delete from class_types where id = '91518450-dae2-4a0f-8404-0178f227de45';
