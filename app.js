import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));

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

// deletes selected post
app.post("/post/:slug/delete", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
    const postIndex = posts.findIndex(p => p.slug === req.params.slug);
    
    posts.splice(postIndex, 1);

    for (let i = postIndex; i < posts.length; i++) {
        posts[i].id = i + 1;
    }

    fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));

    res.redirect("/");
});

// loads new post page
app.get("/new-post", (req, res) => {
    res.render("newPost.ejs", { post: null });
});

// load post to be edited
app.get("/edit-post/:slug", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
    const post = posts.find(p => p.slug === req.params.slug);

    res.render('newPost.ejs', { post: post });
});

// this will create and add the new post to the posts JSON file
app.post("/new-post", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));

    const newPost = {
        id: posts.length + 1,
        slug: slugGenerator(req.body.title),
        title: req.body.title,
        date: new Date().toISOString().split('T')[0],
        excerpt: req.body.excerpt,
        content: req.body.content
    }
    
    posts.push(newPost);

    fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));

    res.redirect("/");
});

// this will edit the current selected post from the posts JSON file
app.post("/edit-post/:slug", (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
    const post = posts.find(p => p.slug === req.params.slug);
    const postIndex = posts.findIndex(p => p.slug === req.params.slug);
    
    const editPost = {
        id: post.id,
        slug: slugGenerator(req.body.title),
        title: req.body.title,
        date: new Date().toISOString().split('T')[0],
        excerpt: req.body.excerpt,
        content: req.body.content
    }

    posts[postIndex] = editPost;

    fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));

    res.redirect("/");
});

// converts the title into a slug
function slugGenerator(title) {
    let slug = title.toLowerCase().replaceAll(" ", "-");
    return slug;
}

// listens to the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});     