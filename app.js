import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));

// loads root or index page
app.get("/", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
    res.render("index.ejs", { posts: posts });
});

// loads about page
app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// loads selected post
app.get("/post/:slug", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
    const post = posts.find(p => p.slug === req.params.slug);

    if (!post) {
        res.status(404).send("Post not found");
        return;
    }

    const previousPost = posts.find(p => p.id === post.id - 1) || null;
    const nextPost = posts.find(p => p.id === post.id + 1) || null;

    res.render("post.ejs", { post: post, posts: posts, previousPost: previousPost, nextPost: nextPost});
});

// loads new post page
app.get("/new-post", (req, res) => {
    res.render("newPost.ejs");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});