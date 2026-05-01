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

app.get("/post/:slug", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
    const post = posts.find(p => p.slug === req.params.slug);

    if (!post) {
        res.status(404).send("Post not found");
        return;
    }

    res.render("post.ejs", { post: post });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});