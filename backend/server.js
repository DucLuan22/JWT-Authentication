const dotevn = require("dotenv").config({ path: "../config.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const errorHandler = require("./middleware/error");
//ConnectDB
connectDB();
const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use(cors);

//Error Handler (should be last piece of middleware)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log("The server is running port", PORT);
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});
