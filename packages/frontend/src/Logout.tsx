import { FC } from "react";
import Button from "@mui/material/Button";

type Props = {
  children?: React.ReactNode;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Logout: FC<Props> = ({ children, setLoggedIn }) => {
  return (
    <Button
      variant="contained"
      onClick={async () => {
        await fetch("http://localhost:8080/logout");
        setLoggedIn(false);
      }}
    >
      {children ?? "Logout"}
    </Button>
  );
};

export default Logout;
