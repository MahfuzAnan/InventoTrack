const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth.middleware');
const { upload } = require("../middlewares/upload.middleware");
const { 
    getAddProduct,
    postAddProduct,
    getProductById,
    getViewProducts,
    getUpdateProduct,
    postUpdateProduct,
    deleteProductById,
    getReport
} = require('../controllers/product.controller');

router.get('/add-product', ensureAuthenticated, getAddProduct);
router.post('/add-product', upload.fields([
    { name: 'image' },
    { name: 'video' }
]), postAddProduct);

router.get('/view-products', ensureAuthenticated, getViewProducts);

router.get('/product/:productId', ensureAuthenticated, getProductById);

router.get('/report', ensureAuthenticated, getReport);

router.get('/update-product/:productId', ensureAuthenticated, getUpdateProduct);
router.patch('/update-product/:productId', upload.fields([
    { name: 'image' },
    { name: 'video' }
]), postUpdateProduct);

router.delete('/delete-product/:productId', ensureAuthenticated, deleteProductById);

module.exports = router;
