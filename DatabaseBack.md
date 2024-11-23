
## Database Restoration

-- Restore the database from the backup file , Idealy place the .tar file in the C:\ Backup folder  easy to find

-- Run the following command

### Step 1

C:\> cd "Program Files"

C:\Program Files>cd PostgreSQL

C:\Program Files\PostgreSQL>cd 15   -- change the version number to the version of the postgresql server eg 17 instance you are using

C:\Program Files\PostgreSQL\15>cd bin

C:\Program Files\PostgreSQL\15\bin>

#### Step 2
-- Drop the current database
-- Note: The -U postgres -h localhost -p 5432 is the connection details for the database server
-- Note: The redrose is the name of the database you want to restore
C:\Program Files\PostgreSQL\15\bin> dropdb -U postgres -h localhost -p 5432 red_rose

### Step 3
-- Restore the database from the backup file
-- Note: The -U postgres -h localhost -p 5432 is the connection details for the database server
-- Note: The red_rose is the name of the database you want to restore
C:\Program Files\PostgreSQL\15\bin>>pg_restore -U postgres -d postgres -v -F t D:\Felex\personal\redrose-backend\red_rose.tar



### Command to take backup of the database
pg_dump -U postgres -h localhost -p 5432 -F t redrose > "C:\Backup\red_rose.tar"