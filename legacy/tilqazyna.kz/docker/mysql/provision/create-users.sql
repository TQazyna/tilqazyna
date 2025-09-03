-- Create legacy application users and grants
CREATE USER IF NOT EXISTS 'tilalemi'@'%' IDENTIFIED BY 'Til23serv';
GRANT ALL PRIVILEGES ON `tilalemi`.* TO 'tilalemi'@'%';
FLUSH PRIVILEGES;


