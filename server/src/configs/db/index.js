const mongoose = require("mongoose");
const config = require("../index");

module.exports.DBconnect = (app) => {
  mongoose.connect(config.mongoose.url);
  mongoose.connection
    .once("open", () => {
      console.log("Connected to Mongodb...");
      app.emit("ready");
    })
    .on("err", (err) => {
      throw err;
    });
};