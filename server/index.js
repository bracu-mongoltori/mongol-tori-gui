const express = require("express");
const app = express();
const http = require("http");
const websocket = require("ws");
const roslib = require("roslib");

const server = http.createServer(app);
const port = 4000;

// respond with "hello world" when a GET request is made to the homepage
app.get("/keys", (req, res) => {
  const ros = new roslib.Ros({ encoding: "ascii" });

  ros.on('error', function(error) {
    console.error('ROSlib error:', error);
  });

  ros.connect("ws://localhost:9090");
  // console.log("ROS connected");

  const listener = new roslib.Topic({
    ros: ros,
    name: "/keys",
    messageType: "std_msgs/String",
  });

  // Array to store received messages
  listener.subscribe(function (message) {
    res.json(message.data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
