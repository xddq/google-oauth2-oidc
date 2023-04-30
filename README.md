# Sign in with Google - Hands on OAuth2 and OpenId Connect

Minimal and hands on example using the wide spread standard `OpenId Connect`
with the OAuth2.0 flow `authorization grant` to implement `Sign in with Google`.

A user can sign in using google as the identity provider. A user will be
registered inside our app if the authentication did succeed. The user is
persisted inside a PostgreSQL database. The userId is stored inside redis and a
cookie referring to the sessionId will be created on the frontend. This cookie
will be used so that the frontend/SPA can authenticate itself against our
backend/API. To complete the basic scenarios, the logged in user can also delete
the account.

## Demo

<img src="https://github.com/xddq/google-oauth2-oidc/blob/main/demo.gif">

# Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) installed
- dbmate installed for raw SQL migrations
  - [install docs](https://github.com/amacneil/dbmate#installation)
- docker and docker-compose installed

# Quickstart

- ❗You need to create your own client_id and client_secret for this to work.
  You can fine the according google docu
  [here](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
  ❗
- Adapt the env.local file. Add your own client_id and client_secret there (also
  in the `VITE_X` variables).
- Use correct node version `nvm install && nvm use` (in root of repo)
- Install yarn `npm i -g yarn`
- Install packages `yarn --immutable`
- Set environment variables in root of repo:
  - `cp env.local .env`
  - `cp .env ./packages/database/.env`
  - `cp .env ./packages/backend/.env`
  - `cp .env ./packages/frontend/.env`
- Build all dependencies:
  - `yarn workspaces foreach -vt run build`
- Generate types based on database schema:
  - `yarn generate-types`
- Spin up postgreSQL and redis `docker-compose up -d`
- Set up the database by running migrations `dbmate create` and `dbmate up`
- Start frontend and backend:
  - frontend: `yarn workspace @app/frontend dev`
  - backend: `yarn workspace @app/backend dev`
- Browse http://localhost:5173 and test the app :]

# Notes/Learnings

- This code is mostly a quick "hack together" to get the basics working. It is
  simply used to practically demonstrate a full example how `sign in with
google` can be implemented when we have a SPA in the frontend and a separate
  server as the API.
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
  First I thought of manually validating, but I decided to skip this part. Using
  jose, it easy to validate the id_token (jwt) based on a remote jwks.
- If you want to implement `sign in with google` or similar, I would take a look
  at [auth.js](https://authjs.dev/) and check whether services like Auth0 or
  similar would be a better fit.
