const express = require("express");
const cors = require("cors");
const uuid = require("uuid");

const app = express();
const port = 5000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (job != undefined && name != undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else if (job != undefined) {
    let result = findUserByJob(job);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["job"] === job && user["name"] === name
  );
};

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined || result.length == 0)
    res.status(404).send("Resource not found.");
  else {
    result = { users_list: result };
    res.send(result);
  }
});

function findUserById(id) {
  return users["users_list"].find((user) => user["id"] === id); // or line below
  //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const updatedUser = addUser(userToAdd);
  res.status(201).send(updatedUser).end();
});

function addUser(user) {
  const userWithID = {
    id: String(uuid.v4()),
    name: user.name,
    job: user.job,
  };
  users["users_list"].push(userWithID);
  return userWithID;
}

app.delete("/users/:id", (req, res) => {
  const userToDelete = req.params["id"];
  const result = deleteUserById(userToDelete);
  if (result == -1) {
    res.status(404).end();
  } else {
    res.status(200).end();
  }
});

function deleteUserById(id) {
  const i = users["users_list"].findIndex((user) => user["id"] === id);
  users["users_list"].splice(i, 1);
  return i;
}
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
