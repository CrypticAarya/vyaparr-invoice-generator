import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ 
    success: true, 
    data: { products } 
  });
});

export const createProduct = catchAsync(async (req, res, next) => {
  const product = new Product({ ...req.body, userId: req.user.id });
  await product.save();
  res.status(201).json({ 
    success: true, 
    data: { product } 
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!product) return next(new AppError('Product not found', 404));
  res.json({ 
    success: true, 
    data: { product } 
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!product) return next(new AppError('Product not found', 404));
  res.json({ 
    success: true, 
    data: { message: 'Product deleted' } 
  });
});
