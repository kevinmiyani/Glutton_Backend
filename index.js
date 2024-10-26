const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./database/DB");
const initializeSocket = require("./socket");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const errorHandler = require("./utils/ErrorHandler");
const deactivateExpiredRestaurants = require('./cron/deactivateRestaurants');
const cancelUnverifiedBookings = require('./cron/cancelUnverifiedBookings');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = initializeSocket(server);

connectDB();
deactivateExpiredRestaurants();
cancelUnverifiedBookings();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use("/api", routes);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
