INSERT INTO public.account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

DELETE FROM account
WHERE account_firstname = 'Tony';

UPDATE public.inventory
SET inv_description = REPLACE(inv_description,'the small interiors', 'a huge interior')
WHERE inv_make = 'GM';

SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification.classification_id = 2;

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
