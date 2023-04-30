import { FC } from "react";
import Button from "@mui/material/Button";

const autorization_endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const scope = ["openid", "profile", "email"].join(" ");
const response_type = "code";

type Props = {
  children?: React.ReactNode;
  client_id: string;
  redirect_uri: string;
};

const SignInWithGoogle: FC<Props> = ({ children, client_id, redirect_uri }) => {
  return (
    <Button
      variant="contained"
      href={
        autorization_endpoint +
        "?" +
        new URLSearchParams({
          client_id,
          scope,
          response_type,
          redirect_uri,
        }).toString()
      }
    >
      {children ?? "Sign in with google"}
    </Button>
  );
};

export default SignInWithGoogle;
