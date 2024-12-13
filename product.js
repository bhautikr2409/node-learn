const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://0.0.0.0:27017/ecom')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err))

const dataSchema = new mongoose.Schema({
    id: { type: String, required: true },
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
    const { id, title, price, description, image } = req.body;
    try {
        const newData = new DataModel({ id, title, price, description, image });
        await newData.save();
        res.status(201).json({ message: "Data added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding data", error: err });
    }
});



// app.put("api/products/:id", async (req, res) => {
//     const { id } = req.params
//     const updateData = req.body
//     try {
//         const result = await DataModel.findOneAndUpdate({ id }, updateData, {
//             new: true
//         })
//         if (!result) {
//             res.status(404).json({ message: "Data not found" });
//         }
//         res.status(200).json({message:"Data updated successfully" , data: result})
//     }
//     catch (err){
//         res.status(500).json({message:"error updating data" , error: err})
//     }
// })

// app.delete("api/products/:id", async (req, res) => {
//     const { id } = req.params
//     try {
//         const result = await DataModel.findOneAndDelete({ id })
//         if (!result) {
//             res.status(404).json({ message: "Data not found" });
//         }
//         res.status(200).json({message:"Data deleted successfully"})
//     }
//     catch (err){
//         res.status(500).json({message:"error deletting data" , error: err})
//     }
// })



app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        // Assuming your MongoDB model uses _id as the primary key
        const result = await DataModel.findOneAndUpdate({ _id: id }, updateData, {
            new: true
        });
        if (!result) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data updated successfully", data: result });
    } catch (err) {
        res.status(500).json({ message: "Error updating data", error: err });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Assuming your MongoDB model uses _id as the primary key
        const result = await DataModel.findOneAndDelete({ _id: id });
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

