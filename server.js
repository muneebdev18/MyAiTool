import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import { HfInference } from "@huggingface/inference";
import database from "./database/dbConfig.js";
import routes from "./routes/index.js";
import endPoint from "./utils/endPoint.js";
import passport from "passport";
import session from "express-session";
import "./passport-setup.js"; // Import Passport setup
import User from "./models/user.model.js";
import sendResponse from "./utils/sendResponse.js";

const app = express();
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

// Serve static files from 'public' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
  session({
    secret: process.env.PASSPORT_SECRET_KEY, // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google auth routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",  // Optional, redirects to the homepage on failure
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/");
    }

    // Redirect with user email as a query parameter
    res.redirect(`http://localhost:3000/?email=${encodeURIComponent(req.user.email)}&googleId=${req.user.googleId}`);
  }
);
app.get("/auth/callback/success", async (req, res) => {
  console.log("req.user",req.user);
  if (!req.user) {

  res.redirect("/");
  // return res.status(200).send(sendResponse(true, "User Login Success", data));
  }
  console.log("Welcome " + req.user?.email);
  res.send("Welcome " + req.user?.email);
  // // -------------------
  // const user = await User.findById({ _id: req.user._id });
  // console.log("idddd", req.user._id);
  // if (!user) {
  //   return res.status(404).send(sendResponse(false, "User Not FOUND"));
  // }
  // let token = await user.generateAccessToken();
  // const data = {
  //   user: user,
  //   token: token,
  // };
  // return res.status(200).send(sendResponse(true, "User Login Success", data));
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Serve index.html on the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Add your other API routes here
app.use("/api", routes);

// Catch-all route for undefined paths
// app.route("*").get(endPoint).post(endPoint).put(endPoint).delete(endPoint);

// Create a directory for archived images if it doesn't exist
const archivedImagesDir = path.join(__dirname, "archived_images");
fs.mkdir(archivedImagesDir, { recursive: true }, (err) => {
  if (err) {
    console.error("Error creating directory:", err);
  } else {
    console.log("Directory created successfully");
  }
});

// Route to generate images using Stable Diffusion
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const blob = await hf.textToImage({
      inputs: prompt,
      model: MODEL,
      parameters: { negative_prompt: "blurry" },
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64 = buffer.toString("base64");

    res.json({ image: `data:image/jpeg;base64,${base64}` });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send(`Error generating image: ${error.message}`);
  }
});

// Route to get archived images
app.get("/api/archived-images", async (req, res) => {
  try {
    const files = await fs.readdir(archivedImagesDir);
    const imageUrls = files.map((file) => `/archived_images/${file}`);
    res.json(imageUrls);
  } catch (error) {
    console.error("Error reading archived images:", error);
    res.status(500).send("Error retrieving archived images");
  }
});

// Route to add an image to the archive
app.post("/api/archive-image", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).send("Image URL is required");
  }

  try {
    const response = await fetch(imageUrl);
    if (response.ok) {
      const buffer = await response.buffer();
      const fileName = `image_${Date.now()}.png`;
      await fs.writeFile(path.join(archivedImagesDir, fileName), buffer);
      res.json({ success: true, fileName });
    } else {
      res.status(response.status).send("Failed to fetch image");
    }
  } catch (error) {
    console.error("Error archiving image:", error);
    res.status(500).send("Error archiving image");
  }
});

// Route to delete an archived image
app.delete("/api/archived-images/:fileName", async (req, res) => {
  const { fileName } = req.params;
  try {
    await fs.unlink(path.join(archivedImagesDir, fileName));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting archived image:", error);
    res.status(500).send("Error deleting archived image");
  }
});

// Serve archived images statically
app.use("/archived_images", express.static(archivedImagesDir));

const PORT = process.env.PORT || 3000;
database();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
