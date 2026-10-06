const express = require("express");
const app = express();
const path = require("path");
const fs = require("node:fs");
const { title } = require("node:process");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
//read file
app.get("/", function (req, res) {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.error("Unable to scan directory:", err);
      return res.status(500).send("Unable to read files");
    }

    console.log(files);

    res.render("index", { files: files });
  });
});

//create file
app.post("/create", function (req, res) {
  const { title, details } = req.body;

  fs.writeFile(`./files/${title}.txt`, details, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Error creating file");
    }

    console.log("File written successfully!");
    res.redirect("/");
  });
});

app.get("/files/:files", function (req, res) {
  const { files } = req.params;

  fs.readFile(`./files/${files}`, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    res.render("show", { files, data });
  });
});

app.get("/edit/:files", function (req, res) {
  const { files } = req.params;

  fs.readFile(`./files/${files}`, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    const title = files.replace(".txt", "");

    res.render("edit", {
      title,
      details: data,
      files,
    });
  });
});

app.post("/update/:files", function (req, res) {
  const { files } = req.params;
  const { details } = req.body;
  

  fs.writeFile(`./files/${files}`, details, (err) => {
    if (err) {
      return res.status(500).send("Error saving file");
    }

    res.redirect("/");
  });
});

app.get("/delete/:files", function (req, res) {

  const { files } = req.params;
  fs.unlink(`./files/${files}`, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    console.log("File deleted successfully");
    res.redirect("/");
  });
});

app.listen(3000, function () {
  console.log("here we go again");
});
