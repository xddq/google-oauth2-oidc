# Sign in with Google - Hands on OAuth2 and OpenId Connect

Minimal, hands on example using the wide spread standard `OpenId Connect` with the
OAuth2.0 flow `authorization grant` to implement `Sign in with Google`.

- The user can sign in using google as the identity provider. A user will be
  registered inside our app if the authentication did succeed. The user is
  persisted inside a PostgreSQL database. The userId is stored inside redis and a
  cookie referring to the sessionId will be created on the frontend. This cookie
  will be used so that the frontend/SPA can authenticate itself against our
  backend/API. To complete the basic scenarios, the logged in user can also
  delete the account.

# Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) installed
- dbmate installed for raw SQL migrations
  - [install docs](https://github.com/amacneil/dbmate#installation)
- docker and docker-compose installed

# Quickstart

- ❗You need to create your own client_id for this to work! You can uup your
- Use correct node version `nvm install && nvm use` (in root of repo)
- Install yarn `npm i -g yarn`
- Install packages `yarn`
- Set environment variables in root of repo:
  - `cp env.local .env`
- Set up env variables in each project:
  - `cp env.local ./packages/database/.env`
  - `cp env.local ./packages/backend/.env`
  - `cp env.local ./packages/frontend/.env`
- Generate types based on database schema:
  - `yarn generate-types`
- Build all dependencies:
  - `yarn workspaces foreach -vpt run build`
- Spin up postgreSQL and redis `docker-compose up -d`
- Set up the database by running migrations `dbmate up`
- Start frontend and backend:
  - frontend: `yarn workspace @app/frontend dev`
  - backend: `yarn workspace @app/backend dev`
- Browse http://localhost:5173 and test the app :]

# Notes/Learnings

- One can use the [OpenId Connect discovery mechanism](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig) and query the "./.well-known/openid-configuration" file for a given identity
  provider. This file holds almost all required information to implement OAuth2 /
  OpenId connect. For example for google we can find it
  [here](https://accounts.google.com/.well-known/openid-configuration). The file
  is also stored in this repo at `./google-openid-configuration` for reference.
- While the RFC for [OAuth2](https://www.rfc-editor.org/rfc/rfc6749) and the
  [OpenId Connect specification](https://openid.net/connect/) are the source of
  truth, companies like Okta and Curity do a great job at helping to understand
  the concepts. Valueable resources I found:
  - [okta youtube oauth2 openid connect](https://www.youtube.com/watch?v=t18YB3xDfXI)
  - [jwt.io (by okta)](https://jwt.io/)
  - [curity validating id token](https://curity.io/resources/learn/validating-an-id-token/)
  - [okta validating id token](https://developer.okta.com/docs/guides/validate-id-tokens/main/)
- [jose](https://github.com/panva/jose) is a great lirary to use with jwts.
  Using it, it was easy to validate the id_token (jwt) based on a remote jwks.
