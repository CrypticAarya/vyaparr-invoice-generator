import Client from '../models/Client.js';

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch clients' });
  }
};

export const createClient = async (req, res) => {
  try {
    const client = new Client({ ...req.body, userId: req.user.id });
    await client.save();
    res.status(201).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create client' });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update client' });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete client' });
  }
};
