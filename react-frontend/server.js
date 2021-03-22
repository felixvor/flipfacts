const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 5000;

const app = express();

const meta = {
    "default":{
        "title": "FlipFacts.net - Scientific sources for your everyday assumptions.",
        "description": `FlipFacts - Search everyday assumptions and find scientific sources. 
                        FlipFacts is a website where you can post and rate short statements. 
                        However, for each positive or negative rating you must provide a scholarly source 
                        that supports or contradicts the statement you want to rate.
                        Look for claims by other users and find reputable references for your shower thoughts.`
    },
    "about":{
        "title":"FlipFacts - About",
    },
    "search":{
        "title":"FlipFacts - Search",
        "description":false

    },
    "browse":{
        "title":"FlipFacts - Browse",
        "description":false
    },
}

app.get("/", (req, res) => {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    data = data
      .replace(/__TITLE__/g, meta.default.title)
      .replace(/__DESCRIPTION__/g, meta.default.description);

    res.send(data)
  });
});


app.get("/:page", (req, res) => {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    let title = meta.default.title
    let description = meta.default.description

    if (meta[req.params.page]){
        if (typeof meta[req.params.page].title !== "undefined") {
            title = meta[req.params.page].title
        }
        if (typeof meta[req.params.page].description !== "undefined") {
            description = meta[req.params.page].description
        }
    }
    data = data
      .replace(/__TITLE__/g, title)
      .replace(/__DESCRIPTION__/g, description);
    res.send(data)
  });
});

app.get("/claims/:id", (req, res) => {
    const filePath = path.resolve(__dirname, "./build", "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      data = data
        .replace(/__TITLE__/g, `FlipFacts - Claim ${req.params.id}`)
        .replace(/__DESCRIPTION__/g, `blabla`);
      res.send(data)
    });
  });

app.use(express.static(path.resolve(__dirname, "./build")))

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})