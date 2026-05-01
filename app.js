import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
    res.render("index.ejs", { posts: posts });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/post", (req, res) => {
    res.render("post.ejs");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});