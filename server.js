const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Database connection
connectDB();

//initialize middleware
//In oreder to access req body we have to use middleware
app.use(express.json({ extended: false }));
//it is used to accept json data

app.get("/", (req, res) => res.json({ msg: "Welcome to Contact-Manager API" }));

//Defining routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
