const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session"); // You'll need to install this

const app = express();
app.use(
  cors({
    origin: true, // Allow requests from any origin temporarily for debugging
    credentials: true,
  })
);
app.use(express.json());

// Add session middleware before your routes
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hour
  })
);

// Serve static files from 'public' folder
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/foodieDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  instructions: String,
});
const Recipe = mongoose.model("Recipe", recipeSchema);

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  username: String,
  email: String,
  password: String,
  phone: String,
  address: String, // Added address field
});
const User = mongoose.model("User", userSchema);

// Define Invoice Schema
const invoiceSchema = new mongoose.Schema({
  buyerName: String,
  buyerAddress: String,
  items: [
    {
      product: String,
      price: Number,
    },
  ],
  subtotal: Number,
  shipping: Number,
  totalAmount: Number,
  paymentStatus: String,
});
const Invoice = mongoose.model("Invoice", invoiceSchema);

// API to Save Invoice
app.post("/save-invoice", async (req, res) => {
  try {
    console.log("Received Invoice Data:", req.body);
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.json({ message: "Invoice saved successfully!" });
  } catch (err) {
    console.error("Error Saving Invoice:", err);
    res.status(500).json({ error: err.message });
  }
});

// API to fetch recipes
app.get("/getRecipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get user details by email
app.get("/getUser", async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameters
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send password to the client
    const userData = {
      name: user.name,
      age: user.age,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to update user profile
app.put("/updateUser", async (req, res) => {
  try {
    const { email, name, address, phone } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, address, phone },
      { new: true }
    ).select("-password"); // Exclude password from the response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to register a user
app.post("/register", async (req, res) => {
  try {
    const { name, age, username, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const newUser = new User({
      name,
      age,
      username,
      email,
      password,
      phone,
      address,
    });
    await newUser.save();

    // Store user info in session
    req.session.userEmail = email;
    req.session.isLoggedIn = true;

    res.json({ message: "User Registered Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to login a user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Store user info in session
    req.session.userEmail = email;
    req.session.isLoggedIn = true;

    console.log("User logged in successfully:", user.email);
    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        address: user.address || "",
        phone: user.phone || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// New logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// Check if user is logged in API endpoint
app.get("/api/check-auth", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session && req.session.isLoggedIn) {
    res.json({ isLoggedIn: true, email: req.session.userEmail });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
