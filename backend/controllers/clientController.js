import Client from '../models/Client.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getClients = catchAsync(async (req, res, next) => {
  const clients = await Client.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ 
    success: true, 
    data: { clients } 
  });
});

export const createClient = catchAsync(async (req, res, next) => {
  const client = new Client({ ...req.body, userId: req.user.id });
  await client.save();
  res.status(201).json({ 
    success: true, 
    data: { client } 
  });
});

export const updateClient = catchAsync(async (req, res, next) => {
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!client) return next(new AppError('Client not found', 404));
  res.json({ 
    success: true, 
    data: { client } 
  });
});

export const deleteClient = catchAsync(async (req, res, next) => {
  const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!client) return next(new AppError('Client not found', 404));
  res.json({ 
    success: true, 
    data: { message: 'Client deleted' } 
  });
});
