var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//App Config
mongoose.connect("mongodb://localhost/BlogApp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Restful Routes
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});


var Blog = mongoose.model("Blog", blogSchema);

//title
//image
//body
//created

// Blog.create({
//     title: "My First Blog",
//     image: "http://photosforclass.com/download/7626464792",
//     body: "This is my first time here"
// }, function(err, blog){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("New Blog Created:");
//         console.log(blog);
//     }
// })
//INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});
//INDEX
app.get("/", function(req, res){
    res.redirect("/blogs");
});
//NEW
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE
app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs");
       }
   }); 
});

//SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog:foundBlog});
        }
    })
});

//EDIT
app.get("/blogs/:id/edit",function(req,res){
    
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog:foundBlog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE 
app.delete("/blogs/:id", function(req,res){
    
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});
    


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Started");
});