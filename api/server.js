// implement your server here
// require your posts router and connect it here

const express = require("express");
const postsRouter = require("./posts/posts-router");

const server = express();

server.use(express.json());

//ENDPOINTS: 
server.use("/api/posts", postsRouter);

module.exports = server; //module.exports is a global and if you set it to something that something can be required from other modules
