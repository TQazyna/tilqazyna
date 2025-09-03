Place your MySQL dump files here to initialize or restore the database.

Supported formats by the mysql:5.7 entrypoint:
- Plain .sql files (executed in alphanumeric order)
- Gzipped .sql.gz files

Recommended dump command on the old server:

mysqldump -u<USER> -p --host=<HOST> --single-transaction --routines --triggers --events --default-character-set=utf8 --databases <DB_NAME> | gzip -9 > tilqazyna-$(date +%F).sql.gz

Then copy the file into this folder and (re)start the MySQL container:

docker compose -f ../../../../docker-compose.legacy.yml down
docker compose -f ../../../../docker-compose.legacy.yml up -d mysql


