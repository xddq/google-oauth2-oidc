/**
 * @file Entrypoint of the application.
 */
import app from "@/express-app";
import { Logger } from "@app/utils";

const port = 8080;
app.listen(8080, () => {
  Logger.log(`HTTPS Webserver listening on port: ${port}`);
});
