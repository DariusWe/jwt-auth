import "./App.css";
import { useState } from "react";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:3001/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Save token in a local storage
          localStorage.setItem("token", data.token);
          console.log(
            "Success! You are now authenticated. A JWT (expires in 1h) has been saved in your browsers local storage. Try to fetch confidential data from the server by clicking on 'My Profile'."
          );
        } else {
          console.log(data.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const requestConfidentialData = () => {
    const token = localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "";

    fetch("http://localhost:3001/my", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={requestConfidentialData}>My Profile</button>
    </>
  );
};

export default App;
