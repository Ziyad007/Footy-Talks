// Importing required modules
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { blogPosts } from "./blogPosts.js";

// Load environment variables
dotenv.config();

// Initialize Express and Middleware
const app = express();
app.set("view engine", "ejs");
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
//Render Home Page
app.get("/", (req, res) => {
  try {
    res.render("Home.ejs");
  } catch (error) {
    console.error("Error rendering Home page:", error);
    res.status(500).send("An error occurred while rendering the Home page.");
  }
});

//Display all blog posts
app.get("/View", (req, res) => {
  try {
    res.render("View.ejs", { blogPosts });
  } catch (error) {
    console.error("Error rendering View page:", error);
    res.status(500).send("An error occurred while fetching blog posts.");
  }
});

// Create a post
app.post("/CreatePost", (req, res) => {
  try {
    const newPost = {
      Id: blogPosts.length + 1,
      Title: req.body.Title,
      Content: req.body.Content,
      createdAt: new Date(),
      createdBy: req.body.createdBy,
    };
    blogPosts.push(newPost); // Add the new post to the array
    res.render("View.ejs", { blogPosts }); // Render the updated View page
  } catch (error) {
    console.error("Error creating a new post:", error);
    res.status(500).send("An error occurred while creating the post.");
  }
});

// Render the Edit page
app.get("/Edit/:id", (req, res) => {
  try {
    const currentPost = blogPosts.find((p) => p.Id === parseInt(req.params.id)); // Find the post by ID
    if (currentPost) {
      res.render("Edit.ejs", { currentPost });
    } else {
      res.status(404).send("Post not found.");
    }
  } catch (error) {
    console.error("Error rendering Edit page:", error);
    res.status(500).send("An error occurred while rendering the Edit page.");
  }
});

// Edit a specific post
app.post("/Edit/:id", (req, res) => {
  try {
    const post = blogPosts.find((p) => p.Id === parseInt(req.params.id)); // Find the post by ID
    if (post) {
      post.Title = req.body.Title;
      post.Content = req.body.Content;
      post.createdBy = req.body.createdBy;
      post.createdAt = new Date();
      res.redirect("/View"); // Redirect to the View page after editing
    } else {
      res.status(404).send("Post not found.");
    }
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).send("An error occurred while editing the post.");
  }
});

// Delete a post
app.post("/Delete/:id", (req, res) => {
  try {
    const del = blogPosts.findIndex((p) => p.Id === parseInt(req.params.id)); // Find the index of the post to delete
    if (del !== -1) {
      blogPosts.splice(del, 1); // Remove the post from the array
      res.redirect("/View"); // Redirect to the View page after deletion
    } else {
      res.status(404).send("Post not found.");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("An error occurred while deleting the post.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
  console.log(`http://localhost:${port}/`);
});
