import ProductService from '../services/ProductService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getProducts = catchAsync(async (req, res, next) => {
  const products = await ProductService.getAllForUser(req.user.id);
  res.json({ 
    success: true, 
    data: { products } 
  });
});

export const createProduct = catchAsync(async (req, res, next) => {
  const product = await ProductService.create(req.user.id, req.body);
  res.status(201).json({ 
    success: true, 
    data: { product } 
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  try {
    const product = await ProductService.update(req.params.id, req.user.id, req.body);
    res.json({ 
      success: true, 
      data: { product } 
    });
  } catch (err) {
    return next(new AppError('Product not found or access denied', 404));
  }
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  try {
    await ProductService.delete(req.params.id, req.user.id);
    res.json({ 
      success: true, 
      data: { message: 'Product deleted' } 
    });
  } catch (err) {
    return next(new AppError('Product not found or access denied', 404));
  }
});

export const getProductLedger = catchAsync(async (req, res, next) => {
  const transactions = await ProductService.getLedger(req.params.id, req.user.id);
  res.json({ 
    success: true, 
    data: { transactions } 
  });
});
