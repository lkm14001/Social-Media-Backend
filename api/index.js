const mongoConnection = require("../mongo/connection/connection");
mongoConnection ();

const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

const cors = require("cors");

const { createServer } = require("http");
const { Server } = require("socket.io");

// const httpServer = createServer(app);

// const SocketIO = new Server(httpServer, {
//   cors: {
//     origin:
//       process.env.NODE_ENV === "production"
//         ? process.env.CLIENT_URL
//         : "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },

// });



app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

const userRoute = require("../routes/userRoute");
const profileInteractionRoute = require("../routes/profileInteractionsRoute");
const validateToken = require("../util/validateToken");

//Routes
app.use("/user", userRoute);
app.use("/profile", validateToken, profileInteractionRoute);

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});


module.exports = app;