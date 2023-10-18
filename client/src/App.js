import React from "react";
import "./App.css";
import { UserContextProvider } from "./components/UserContext";
import axios from "axios";
import Outlet from "./components/Outlet";
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
      <React.Fragment>
        <Outlet />
      </React.Fragment>
    </UserContextProvider>
  );
}

export default App;
