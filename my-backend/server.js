// server.js

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected!");
});
function getRelativePath(absolutePath) {
  // Assuming 'public/' is the part of the path that precedes the relative path
  const index = absolutePath.indexOf("public/");
  if (index !== -1) {
    // Return the path after 'public/'
    return absolutePath.slice(index + "public/".length);
  }
  // If 'public/' is not found, return the original path (or handle as needed)
  return absolutePath;
}
//setup proxy access
const cheerio = require("cheerio");
app.get("/api/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("No URL provided");
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract specific elements, e.g., article text
    const articleContent = $("article").html(); // Adjust selector as needed
    console.log(articleContent);
    res.send(articleContent); // Return the extracted HTML
  } catch (error) {
    console.error("Error fetching the URL:", error);
    res.status(500).send("Error fetching the URL");
  }
});

// Register endpoint
app.post("/api/register", (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, hashedPassword, email],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send("User registered!");
    }
  );
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log("got here0");

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err); // Log the error for better insight
        return res.status(500).send("Internal server error");
      }
      if (results.length === 0) return res.status(404).send("User not found.");

      const user = results[0];
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({ auth: true, token });
      } else {
        res.status(401).send("Invalid credentials.");
      }
    }
  );
});

// Password reset endpoint (simplified)
app.post("/api/reset-password", (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, email],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send("Password reset successful.");
    }
  );
});

// Task results endpoint (simplified)
/* app.get('/api/tasks', (req, res) => {
    console.log('got here0wer');
    const sql = 'SELECT * FROM tasks'; // Your query to get all tasks
    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
}); */

app.get("/api/tasks", (req, res) => {
  console.log("API call received for tasks");
  const sql = "SELECT * FROM tasks";
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    console.log("Fetched tasks:", results); // Log the results
    res.json(results);
  });
});

app.get("/api/test-connection", (req, res) => {
  pool.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) {
      console.error("Error testing connection:", err);
      return res.status(500).json({ error: "Connection test failed" });
    }
    res.json({
      message: "Connection is working",
      solution: results[0].solution,
    });
  });
});

app.post("/api/check-content", (req, res) => {
  const { url } = req.body;
  const query = "SELECT * FROM tasks WHERE url = ?";
  db.query(query, [url], (err, results) => {
    if (err) return res.status(500).send({ error: err });
    if (results.length > 0) {
      res.send({ exists: true, task: results[0] });
    } else {
      res.send({ exists: false });
    }
  });
});

app.post("/api/scrape", async (req, res) => {
  const {
    task_name,
    url,
    media_source,
    topic,
    subtopic,
    users,
    details,
    thumbnail_url,
    assigned,
    progress,
  } = req.body;

  // Step 1: Insert the task without the thumbnail path
  const query =
    "INSERT INTO tasks (task_name, url, media_source, topic, subtopic, users, details,assigned,progress) VALUES (?, ?, ?, ?, ?,?,?,?,?)";
  db.query(
    query,
    [
      task_name,
      url,
      media_source,
      topic,
      subtopic,
      users,
      details,
      progress,
      assigned,
    ],
    async (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).send("Database error");
      }

      const taskId = result.insertId;
      const imageFilename = `task_id_${taskId}.png`;
      const imagePath = path.resolve(
        __dirname,
        "..",
        "public",
        "assets",
        "images",
        "tasks",
        imageFilename
      );

      try {
        // Step 2: Download and resize the image
        const response = await axios.get(thumbnail_url, {
          responseType: "arraybuffer",
        });
        console.log(thumbnail_url);
        const buffer = Buffer.from(response.data, "binary");

        // Resize the image to 100px width using sharp
        await sharp(buffer).resize({ width: 300 }).toFile(imagePath);

        // Step 3: Update the task with the thumbnail path
        //change thumbnail path from absolute to relative
        const relativeImagePath = getRelativePath(imagePath);
        const updateQuery = "UPDATE tasks SET thumbnail = ? WHERE task_id = ?";
        db.query(updateQuery, [relativeImagePath, taskId], (updateErr) => {
          if (updateErr) {
            console.error("Error updating task with thumbnail:", updateErr);
            return res.status(500).send("Database update error");
          }

          res.status(200).send({ success: true, task_id: taskId });
        });
      } catch (imageError) {
        console.error("Error handling image:", imageError);
        res.status(500).send("Image processing error");
      }
    }
  );
});
// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
