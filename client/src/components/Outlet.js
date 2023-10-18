import { useContext } from "react";
import Register from "./Register";
import { UserContext } from "./UserContext";
import Content from "./Content";

const Outlet = () => {
  const { username, id } = useContext(UserContext);
  if (username) {
    return <Content />;
  }
  return <Register />;
};

export default Outlet;
