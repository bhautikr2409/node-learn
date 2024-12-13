const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/ecom')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err))

const dataSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
})

const DataModel = mongoose.model("ecom", dataSchema);

app.get("/api/products", async (req, res) => {
  try {
      const data = await DataModel.find();
      res.json(data);
      console.log("data", data);
  } catch (err) {
      res.status(500).json({ message: "Error fetching data", error: err });
  }
});

app.post("/api/products", async (req, res) => {
  const {  title, price, description, image } = req.body;
  try {
      const newData = new DataModel({ title, price, description, image });
      await newData.save();
      res.status(201).json({ message: "Data added successfully" });
  } catch (err) {
      res.status(500).json({ message: "Error adding data", error: err });
  }
});

app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try{
        const result = await DataModel.findOneAndUpdate({ id }, updatedData ,{
            new: true,
        });
        if(!result){
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data updated successfully", data: result });
    }
    catch(err){
        res.status(500).json({ message: "Error updating data", error: err });
    }

})


app.delete("/api/products/:id" , async (req,res)=>{
    const { id } = req.params
    try{
        const result = await DataModel.findByIdAndDelete(id);
        if(!result){
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data deleted successfully"});
    }
    catch(err){
        res.status(500).json({ message: "Error deleting data", error: err });
    } 
})

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

