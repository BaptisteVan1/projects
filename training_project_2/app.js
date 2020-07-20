// My app.js
const http = require("http");
// we need fs because each http request will ba handled by creating a readstream and piping it to response
// fs will read the file to be piped
const fs = require("fs");
const mongoose = require("mongoose");
const { parse } = require("querystring");
const { request } = require("http");
const dotenv = require("dotenv").config();

// connect to DB

mongoose.connect("mongodb+srv://cluster0.myfpj.mongodb.net/", {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  userNewUrlParse: true,
  userUnifiedTopology: true,
  userFindandModify: false,
});
// checking if DB is properly connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "An error has occured: "));
db.once("open", function () {
  console.log("db connected");
});

// schema for DB - like a blueprint of everything that will be saved in it
const madeContactSchema = new mongoose.Schema({
  name: String,
  dept: String,
  email: String,
});

const MadeComplaintSchema = new mongoose.Schema({
  name: String,
  complaint: String,
  tel: Number,
});

// const created from schema
const MadeContact = mongoose.model("MadeContact", madeContactSchema);

const MadeComplaint = mongoose.model("MadeComplaint", MadeComplaintSchema);

// function to handle post request for contact
function collectContactData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";

  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
      // creating a const in order to store the posted data
      const postedContactData = parse(body);
      //writing the posted data into the model then saving it to mongoDB
      const newMadeContact = MadeContact({
        name: postedContactData.user_name,
        dept: postedContactData.department,
        email: postedContactData.email,
      }).save(function (err) {
        if (err) throw err;
        console.log("Contact saved");
      });
    });
  } else {
    callback(null);
  }
}

// function to handle post request for complaint
function collectComplaintData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";

  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
      const postedComplaintData = parse(body);
      const newMadeComplaint = MadeComplaint({
        name: postedComplaintData.requester_name,
        complaint: postedComplaintData.content,
        tel: postedComplaintData.tel,
      }).save(function (err) {
        if (err) throw err;
        console.log("Complaint saved");
      });
    });
  } else {
    callback(null);
  }
}

const server = http.createServer(function (req, res) {
  console.log("Request was made at " + req.url);
  if (req.url === "/" || req.url === "/home") {
    // home page
    res.writeHead(200, { "Content-type": "text/html" });
    fs.createReadStream(__dirname + "/html_files/index.html").pipe(res);
  } else if (req.url === "/contact") {
    // create a if statement to manage the post request (not sure about this part but let's try)
    if (req.method === "POST") {
      // calling the contact data management function
      collectContactData(req, (result) => {
        console.log(result);
      });
      // trying to redirect to contact-successafter posting
      res.writeHead(200, { "Content-type": "text/html" });
      fs.createReadStream(__dirname + "/html_files/contact-success.html").pipe(
        res
      );
    } else {
      res.writeHead(200, { "Content-type": "text/html" });
      fs.createReadStream(__dirname + "/html_files/contact.html").pipe(res);
    }
  } else if (req.url === "/complaint") {
    // put complaint stuff here + review the function as it doesn't write at the good place in mongo
    // remember to recreate the pages and forms in html
    if (req.method === "POST") {
      collectComplaintData(req, (result) => {
        console.log(result);
      });
      res.writeHead(200, { "content-type": "text/html" });
      fs.createReadStream(
        __dirname + "/html_files/complaint-success.html"
      ).pipe(res);
    } else {
      res.writeHead(200, { "content-type": "text/html" });
      fs.createReadStream(__dirname + "/html_files/complaint.html").pipe(res);
    }
  } else {
    res.writeHead(200, { "Content-type": "text/html" });
    fs.createReadStream(__dirname + "/html_files/404.html").pipe(res);
  }
});

// configuring the port and address of the localhost
// I chose 3000 here because another app is on 8000 and sometimes the cache does weird stuff
server.listen(3000, "127.0.0.1");
// just a quick console feedback that we're conencted on the right port
console.log("Now listening to port 3000");

// why is hexagonal architecture is called "port and adapter"?
/*  1/ install and configure typescript
        IN PROGRESS
    2/ install docker, play with it
    3/ connect my app into Mongo DB to save data in a table
        DONE - worked on it a second time to make sure I get it well
    4/ run Mongo DB in a docker container
    5/ run my app in another container
    6/ run all of this in a docker compose configuration
        use environmental variables
*/
