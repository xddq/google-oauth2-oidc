import express from "express";
import cors from "cors";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { Logger } from "@app/utils";
import { Database } from "@app/database";
import { DBUsers } from "@app/types";
import * as jose from "jose";

const app = express();

app.set("trust proxy", 1); // trust first proxy (nginx proxy manager)
// Initialize client.
let redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Initialize sesssion storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false,
    secret: "keyboard cat",
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/oauth2/google", async (req, res) => {
  Logger.log("redirected by google! got info:" + JSON.stringify(req.query));

  // We just got redirected by the authorization server to the client. Proceeding with
  // the Access Token Request https://www.rfc-editor.org/rfc/rfc6749#section-4.1.3
  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const grant_type = "authorization_code";
  // note: should parse/validate here instead
  const code = req.query.code as string;
  const redirect_uri = "http://localhost:8080/oauth2/google";

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  if (client_id === undefined || client_secret === undefined) {
    return res.status(500).json({
      error: `your client_secret or client_id is undefined. client_secret: ${client_secret}, client_id: ${client_id}`,
    });
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type,
      code,
      redirect_uri,
      client_id,
      client_secret,
    }).toString(),
  };

  const response = await fetch(tokenEndpoint, requestOptions);
  Logger.log("Response was: ", JSON.stringify(response));

  if (!response.ok) {
    const text = await response.text();
    return res
      .status(400)
      .send(
        "got error fetching the tokenEndpoint!. Response was: " +
          JSON.stringify(text)
      );
  }

  type AccessTokenResponse = {
    scope: "openid";
    token_type: "Bearer";
    // Seconds it takes until the token is invalid again, should be 3599 (1hour)
    expires_in: number;
    // This token can be used to access the requested google services on the
    // resource owners behalf
    access_token: string;
    // This token can be used to retrieve the requested user information about
    // the user.
    id_token: string;
  };

  const responseJson = (await response.json()) as AccessTokenResponse;

  // Validating the id token
  const JWKS = jose.createRemoteJWKSet(
    new URL("https://www.googleapis.com/oauth2/v3/certs")
  );
  // src: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
  // src: https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation
  const { payload, protectedHeader } = await jose.jwtVerify(
    responseJson.id_token,
    JWKS,
    {
      issuer: "https://accounts.google.com",
      // your client_id created in google play api console
      audience: client_id,
    }
  );
  console.log(protectedHeader);
  console.log(payload);

  // Just an example of how the access token could be used to access a given
  // google service in the name of the user that just signed in. The services we
  // will be able to access are specified by the claims we set inside the google
  // play api console when creating the client_id.
  // const requestOptionsUserInfo = {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${responseJson.access_token}`,
  //   },
  // };
  // const userInfoEndpoint = "https://openidconnect.googleapis.com/v1/userinfo";
  // const userInfoResult = await fetch(userInfoEndpoint, requestOptionsUserInfo);
  // const userInfoJson = (await userInfoResult.json()) as UserInfoResponse;
  // if (!userInfoResult.ok) {
  //   const text = await userInfoResult.text();
  //   return res
  //     .status(200)
  //     .send("got error!. Response was: " + JSON.stringify(text));
  // }

  if (!payload.email_verified) {
    return res.status(400).send({
      msg: "You have to verify your google email first! Try again after you have verified your google email!",
    });
  }

  if (process.env.FRONTEND_URL === undefined) {
    return res.status(500).json({ error: "FRONTEND_URL was undefined" });
  }

  // does the user exist already?
  const userRows = await Database.query<DBUsers>({
    text: "SELECT * FROM users WHERE email=$1",
    values: [payload.email],
  });
  Logger.log(userRows);

  // user already exists
  if (userRows.length !== 0) {
    const user = userRows[0];
    req.session.userId = user.id;

    return res.redirect(process.env.FRONTEND_URL);
  }

  const insertedUserRows = await Database.query<DBUsers>({
    text: "INSERT INTO users(name, family_name, given_name, email) VALUES ($1, $2, $3, $4) RETURNING *",
    values: [
      payload.name,
      payload.family_name,
      payload.given_name,
      payload.email,
    ],
  });
  const user = insertedUserRows[0];
  req.session.userId = user.id;
  return res.redirect(process.env.FRONTEND_URL);
});

app.use("/health", (_req, res) => {
  return res.status(200).send("I'm alive :]");
});

app.use("/isLoggedIn", (req, res) => {
  console.log(
    "/isLoggedIn active. current session:" + JSON.stringify(req.session)
  );
  if (req.session.userId === undefined) {
    return res.status(403).json({ error: "is not logged in!" });
  }
  return res.status(200).send("is logged in!");
});

app.use("/logout", (req, res) => {
  req.session.destroy(() => {
    console.log("session destroyed");
  });
  return res.status(200).send("logged out");
});

app.use("/deleteAccount", async (req, res) => {
  if (req.session.userId === undefined) {
    return res
      .status(403)
      .json({ error: "Need to be logged in to delete the account" });
  }

  await Database.query<DBUsers>({
    text: "DELETE FROM users WHERE id = $1",
    values: [req.session.userId],
  });
  return res.status(200).send("user was deleted!");
});

app.use("/", (_req, res) => {
  return res.status(200).send("Up!");
});

export default app;
