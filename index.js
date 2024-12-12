const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://0.0.0.0:27017/mydatabase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schema and Model

const dataSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: String },
});

const DataModel = mongoose.model("Data", dataSchema);

// Fetch all data
app.get("/api/data", async (req, res) => {
  try {
    const data =
     await DataModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err });   
  }
});

// Add new data
app.post("/api/data", async (req, res) => {
  const { id, name, age } = req.body;
  console.log(" id, name", id, name);

  try {
    const newData = new DataModel({ id, name, age });
    await newData.save();
    res.status(201).json({ message: "Data added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding data", error: err });
  }
});

// Update existing data
app.put("/api/data/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await DataModel.findOneAndUpdate({ id }, updatedData, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }
    res
      .status(200)
      .json({ message: "Data updated successfully", data: result });
  } catch (err) {
    res.status(500).json({ message: "Error updating data", error: err });
  }
});

// Delete data
app.delete("/api/data/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await DataModel.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting data", error: err });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

