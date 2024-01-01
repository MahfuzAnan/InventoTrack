const Product = require("../models/Product.model");
const User = require("../models/User.model");

const getAddProduct = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        console.log("User data:", user);

        if (!user) {
            console.log("User not found");
            req.flash("error", "User not found");
            return res.redirect("/dashboard");
        }

        res.render("addProduct.ejs", { user });
    } catch (error) {
        console.error("Error fetching user profile for edit:", error);
        req.flash("error", "Error fetching user profile for edit");
        res.redirect("/dashboard");
    }
};

const postAddProduct = async (req, res) => {
    try {
        const { name, description, category, quantity, price } = req.body;
        const userId = req.user._id;

        const imageFile = req.files['image'][0];
        const videoFile = req.files['video'][0];

        const product = new Product({
            name,
            description,
            category,
            quantityInStock: quantity,
            price,
            user: userId,
            image: imageFile ? imageFile.filename : null,
            video: videoFile ? videoFile.filename : null,
        });

        await product.save();

        req.flash("success", "Product added successfully");
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error adding product:", error);
        req.flash("error", "Error adding product. Please try again.");
        res.redirect("/add-product");
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('singleProduct', { product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getViewProducts = async (req, res) => {
    try {
        const userId = req.user._id;

        const products = await Product.find({ user: userId });

        res.render('viewProducts.ejs', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        req.flash('error', 'Error fetching products');
        res.redirect('/dashboard');
    }
};

const getUpdateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('updateProduct', { product });
    } catch (error) {
        console.error('Error fetching product for update:', error);
        res.status(500).send('Internal Server Error');
    }
};

const postUpdateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description, category, quantity, price } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const videoFile = req.files['video'] ? req.files['video'][0] : null;

        product.name = name;
        product.description = description;
        product.category = category;
        product.quantityInStock = quantity;
        product.price = price;

        if (imageFile) {
            product.image = imageFile.filename;
        }

        if (videoFile) {
            product.video = videoFile.filename;
        }

        await product.save();

        req.flash("success", "Product updated successfully");
        res.redirect("/dashboard");
    } catch (error) {
        console.error('Error updating product:', error);
        req.flash("error", "Error updating product. Please try again.");
        res.redirect("/dashboard");
    }
};

const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        req.flash("success", "Product deleted successfully");
        res.redirect("/dashboard");
    } catch (error) {
        console.error('Error deleting product:', error);
        req.flash("error", "Error deleting product. Please try again.");
        res.redirect("/dashboard");
    }
};

const getReport = async (req, res) => {
    try {
      // Assuming you have user information stored in req.user
      const userId = req.user._id;
  
      // Fetch products associated with the user
      const products = await Product.find({ user: userId });
  
      // Calculate total price for each product
      products.forEach(product => {
        product.totalPrice = product.price * product.quantityInStock;
      });
  
      // Calculate overall total price
      const overallTotal = products.reduce((total, product) => total + product.totalPrice, 0);
  
      // Render the report page with user, products, and overall total
      res.render('report.ejs', { user: req.user, products, overallTotal });
    } catch (error) {
      console.error('Error fetching products for report:', error);
      req.flash('error', 'Error fetching products for report');
      res.redirect('/dashboard'); // Redirect to dashboard or handle the error appropriately
    }
  };

module.exports = {
    getAddProduct,
    postAddProduct,
    getProductById,
    getViewProducts,
    getUpdateProduct,
    postUpdateProduct,
    deleteProductById,
    getReport
};
