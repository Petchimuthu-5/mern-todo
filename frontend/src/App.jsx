import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTasks(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        });
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/api/register", {
      username,
      password,
    });
    alert("Registered successfully! Now login.");
  };

  const addTask = () => {
    axios
      .post(
        "http://localhost:5000/api/tasks",
        { title: task },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setTasks([...tasks, res.data]));
    setTask("");
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsLoggedIn(false);
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      {!isLoggedIn ? (
        <div className="auth-container">
          <h2>Authentication</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-group">
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister} className="register">
              Register
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-input-container">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter a task..."
            />
          </div>
          <div className="add-task-container">
            <button onClick={addTask}>Add</button>
          </div>
          <div className="logout-container">
            <button onClick={logout} className="logout">
              Logout
            </button>
          </div>
          <ul>
            {tasks.map((t) => (
              <li key={t._id}>
                <span>{t.title}</span>
                <button className="delete" onClick={() => deleteTask(t._id)}>
                  X
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
