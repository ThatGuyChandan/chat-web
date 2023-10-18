import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  async function register(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === "register" ? "register" : "login";
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  return (
    <main>
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <label>Person ID:</label>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <br />
        <br />
        <button>
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div>
          {isLoginOrRegister === "register" && (
            <div>
              Already registered?
              <button onClick={() => setIsLoginOrRegister("login")}>
                Login
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Dont have an account?
              <button onClick={() => setIsLoginOrRegister("register")}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </main>
  );
};

export default Register;
