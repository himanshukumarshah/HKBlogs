import express from "express"
import bodyParser from "body-parser";
import session from "express-session";
import flash from "connect-flash";

const app = express();
const port = 7000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = "mahsb32mgh@j3#jfu!ovn75k!gkf?kidbh>uyhudfuh";
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

let blogPosts = [];
let blogID = 101;

app.get("/", (req, res) => {
    res.render("index.ejs", {blogs: blogPosts, successMessage: req.flash("success")});
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/submitNew", (req, res) =>{
    blogPosts.push({
        ID: blogID,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        time: new Date().toLocaleString(),
        updatedTime: 0
    });
    blogID++;
    req.flash("success", "✅ Your blog post has been saved successfully!");
    res.redirect("/");
});

app.get("/view/:ID", (req, res) => {
    const reqID = Number(req.params.ID);
    const post = blogPosts.find(p => p.ID === reqID);

    if(post){
        res.render("view/posts.ejs", {post: post});
    }
    else{
        res.status(404).send("Page not found");
    }
});

app.get("/edit/:ID", (req, res) => {
    const reqID = Number(req.params.ID);
    const post = blogPosts.find(p => p.ID === reqID);

    if(post){
        res.render("edit.ejs", {post: post});
    }
    else{
        res.status(404).send("Page not found");
    }
});

app.get("/delete/:ID", (req, res) => {
    const reqID = Number(req.params.ID);
    const postIdx = blogPosts.findIndex(p => p.ID === reqID);
    if(postIdx !== -1){
        blogPosts.splice(postIdx, 1);
    }
    
    req.flash("success", "✔️ The post has been successfully deleted!");
    res.redirect("/");
});

app.post("/update/:ID", (req, res) => {
    const reqID = Number(req.params.ID);
    const postIdx = blogPosts.findIndex(p => p.ID === reqID);

    if(postIdx !== -1){
        blogPosts[postIdx].title = req.body.title;
        blogPosts[postIdx].author = req.body.author;
        blogPosts[postIdx].content = req.body.content;
        blogPosts[postIdx].updatedTime = new Date().toLocaleString();

        req.flash("success", "✅ The post has been updated!");
    }

    res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.listen(port, () => {
    console.log(`Server is active on "/localhost:${port}"`);
});