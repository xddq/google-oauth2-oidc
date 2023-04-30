-- migrate:up
CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  given_name TEXT NOT NULL,
  email TEXT NOT NULL,

  UNIQUE(email),
  PRIMARY KEY (id)
);

comment on column users.email is 'The email the user did sign in with. E.g. for google identity_provider it is a gmail email. Cant be changed. If user wants to change, rather has to delete the account.';

-- Enables setting updated_at column whenever a value changes in specified
-- tables. Using this for every table.
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE
ON users FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- migrate:down
DROP TRIGGER IF EXISTS update_users_updated_at on users;
DROP TABLE IF EXISTS users;

