-- migrate:up
-- Enables us to use the uuid_generate_v4() function.
-- src: https://www.postgresql.org/docs/14/functions-uuid.html
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- migrate:down
DROP EXTENSION IF EXISTS "uuid-ossp";
