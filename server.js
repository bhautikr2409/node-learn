// fs.writeFile('/test.txt', content, err => {
//   if (err) {
//     console.error(err);
//   } else {
//     // file written successfully
//   }
// });

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Built-in body parser for JSON
app.use(cors());
console.log("__dirname", __dirname);

// JSON file path
const filePath = path.join(__dirname, "data.json");

// Fetch data
app.get("/api/data", (req, res) => {
 
      return res.status(500).json({ message: "Error reading data file" });
   
    res.json(JSON.parse(data));
  
});

// Store new data
app.post("/api/data", (req, res) => {
  const newData = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading data file" });
    }
    console.log("data", data);

    const jsonData = JSON.parse(data);
    jsonData.push(newData);

    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error writing to data file" });
      }
      res.status(201).json({ message: "Data added successfully" });
    });
  });
});

// Update data
app.put("/api/data/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading data file" });
    }

    let jsonData = JSON.parse(data);
    const dataIndex = jsonData.findIndex((item) => item.id === id);

    if (dataIndex === -1) {
      return res.status(404).json({ message: "Data not found" });
    }

    jsonData[dataIndex] = { ...jsonData[dataIndex], ...updatedData };

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error writing to data file" });
      }
      res.status(200).json({ message: "Data updated successfully" });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
