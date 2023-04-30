import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Logout from "./Logout";
import SignInWithGoogle from "./SignInWithGoogle";

const client_id = import.meta.env.VITE_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_REDIRECT_URI;

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8080/isLoggedIn", {
        credentials: "include",
      });
      setLoggedIn(response.ok);
    })();
  }, []);

  if (client_id === undefined || redirect_uri === undefined) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        Either client_id or redirect_uri is undefined. client_id: {client_id},
        redirect_uri: {redirect_uri}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Welcome to my service!</h1>
      {isLoggedIn ? (
        <>
          <div>You are logged in!</div>
          <Logout setLoggedIn={setLoggedIn} />
          <Button
            onClick={async () => {
              const result = await fetch(
                "http://localhost:8080/deleteAccount",
                { credentials: "include" }
              );
              if (!result.ok) {
                console.error("error deleting account.");
                return;
              }
              console.log("account deleted");
              setLoggedIn(false);
            }}
          >
            Delete Account
          </Button>
        </>
      ) : (
        <>
          <div>Please log in first!</div>
          <SignInWithGoogle
            redirect_uri={"http://localhost:8080/oauth2/google"}
            client_id={client_id}
          />
        </>
      )}
    </div>
  );
}

export default App;
