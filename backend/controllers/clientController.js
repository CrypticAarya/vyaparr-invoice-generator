import ClientService from '../services/ClientService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getClients = catchAsync(async (req, res, next) => {
  const clients = await ClientService.getAllForUser(req.user.id);
  res.json({ 
    success: true, 
    data: { clients } 
  });
});

export const createClient = catchAsync(async (req, res, next) => {
  const client = await ClientService.create(req.user.id, req.body);
  res.status(201).json({ 
    success: true, 
    data: { client } 
  });
});

export const updateClient = catchAsync(async (req, res, next) => {
  try {
    const client = await ClientService.update(req.params.id, req.user.id, req.body);
    res.json({ 
      success: true, 
      data: { client } 
    });
  } catch (err) {
    return next(new AppError('Client not found or access denied', 404));
  }
});

export const deleteClient = catchAsync(async (req, res, next) => {
  try {
    await ClientService.delete(req.params.id, req.user.id);
    res.json({ 
      success: true, 
      data: { message: 'Client deleted' } 
    });
  } catch (err) {
    return next(new AppError('Client not found or access denied', 404));
  }
});
