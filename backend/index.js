const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());


// Database Connection With MongoDB
mongoose.connect('mongodb://localhost:27017/Trademe')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.get("/", (req, res) => {
    res.send("Express app is running")
})

// Image Storage Engine 
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

// Creating upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image: `http://localhost:${port}/images/${req.file.filename}`
    })
})
app.use('/images', express.static('upload/images'));

// Schema for creating Product
const Product = mongoose.model("Product", {
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number
    },
    old_price: {
        type: Number
    }
});

// Creating API to add products
app.post("/addproducts", async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            image: req.body.image,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        await product.save();
        console.log("Product saved:", product);
        res.json({ success: true, product });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ success: false, error: "Error saving product" });
    }
});

// Creating API to get all products
app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Error fetching products" });
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port);
    } else {
        console.log("Error:", error);
    }
});
