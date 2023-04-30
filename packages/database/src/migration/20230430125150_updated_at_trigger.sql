-- migrate:up
-- This functions is used to automaticly update the updated_at column for rows
-- of our database. We have to apply this function to each table in our database
-- where we want the functionality to occur.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
      NEW.updated_at = now();
      RETURN NEW;
   ELSE
      RETURN OLD;
   END IF;
END;
$$ language 'plpgsql';

-- A trigger for a table will be created like the following example. Let's say
-- we have a users table:
-- CREATE TRIGGER update_users_updated_at
-- BEFORE UPDATE ON users
-- FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- migrate:down
DROP FUNCTION IF EXISTS update_updated_at_column;
-- On down, we then have to also drop the trigger!
-- DROP TRIGGER IF EXISTS update_users_updated_at on users;

