const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "data.json";

// Load data
function loadData() {
  if (!fs.existsSync(FILE)) {
    return { users: {}, tasks: {}, important: {} };
  }
  return JSON.parse(fs.readFileSync(FILE));
}

// Save data
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// SIGNUP
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const data = loadData();

  if (data.users[username]) {
    return res.send({ error: "User already exists" });
  }

  data.users[username] = password;
  data.tasks[username] = {};
  data.important[username] = {};

  saveData(data);
  res.send({ message: "Signup successful" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const data = loadData();

  if (data.users[username] !== password) {
    return res.send({ error: "Invalid credentials" });
  }

  res.send({ message: "Login successful" });
});

// GET USER DATA
app.get("/data/:username", (req, res) => {
  const data = loadData();
  const user = req.params.username;

  res.send({
    tasks: data.tasks[user] || {},
    important: data.important[user] || {},
  });
});

// SAVE USER DATA
app.post("/save/:username", (req, res) => {
  const data = loadData();
  const user = req.params.username;

  data.tasks[user] = req.body.tasks;
  data.important[user] = req.body.important;

  saveData(data);
  res.send({ message: "Saved" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
