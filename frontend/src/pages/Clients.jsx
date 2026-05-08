import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients';

// UI Components
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Table, { TableRow, TableCell } from '../ui/Table';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import TextArea from '../ui/TextArea';
import PageLoader from '../components/PageLoader';

export default function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // TanStack Query Hooks
  const { data: clients = [], isLoading } = useClients();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  const [formData, setFormData] = useState({
    name: '', company: '', gstin: '', phone: '', email: '', address: '', notes: ''
  });

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({ ...client });
    } else {
      setEditingClient(null);
      setFormData({ name: '', company: '', gstin: '', phone: '', email: '', address: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mutation = editingClient ? updateClientMutation : createClientMutation;
    
    mutation.mutate(
      editingClient ? { id: editingClient._id, data: formData } : formData,
      {
        onSuccess: () => setIsModalOpen(false),
      }
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClientMutation.mutate(id);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Clients" 
        description="Manage your customer relationships and balances."
        actions={
          <>
            <div className="relative">
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" placeholder="Search clients..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 outline-none w-64 transition-all"
              />
            </div>
            <Button onClick={() => handleOpenModal()} icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            )}>
              Add Client
            </Button>
          </>
        }
      />

      <Card noPadding>
        {isLoading ? (
          <div className="py-20"><PageLoader /></div>
        ) : filteredClients.length === 0 ? (
          <EmptyState 
            icon={(props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            title="No clients found"
            description="Start by adding your first customer to manage their invoices and balances."
            actionText="Add First Client"
            onAction={() => handleOpenModal()}
          />
        ) : (
          <Table headers={['Client Name', 'Company / GSTIN', 'Contact', 'Pending', 'Actions']}>
            {(filteredClients || []).map((client) => (
              <TableRow key={client._id}>
                <TableCell>
                  <p className="font-black text-slate-900">{client.name}</p>
                  <p className="text-xs text-slate-400 font-bold">{client.email}</p>
                </TableCell>
                <TableCell>
                  <p className="font-bold text-slate-700">{client.company || 'Individual'}</p>
                  <Badge variant="info" className="mt-1">{client.gstin || 'No GSTIN'}</Badge>
                </TableCell>
                <TableCell>{client.phone || '-'}</TableCell>
                <TableCell className="font-black text-slate-900">
                  ₹{(client.pendingAmount || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => navigate('/new-invoice', { state: { client } })}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      title="Quick Invoice"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </button>
                    <button onClick={() => handleOpenModal(client)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(client._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              isLoading={createClientMutation.isPending || updateClientMutation.isPending}
            >
              {editingClient ? 'Update Client' : 'Save Client'}
            </Button>
          </>
        }
      >
        <form id="client-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Client Name *" 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="e.g. Rahul Sharma" 
          />
          <Input 
            label="Company Name" 
            value={formData.company} 
            onChange={(e) => setFormData({...formData, company: e.target.value})} 
            placeholder="e.g. Acme Corp" 
          />
          <Input 
            label="GSTIN" 
            value={formData.gstin} 
            onChange={(e) => setFormData({...formData, gstin: e.target.value})} 
            placeholder="27AAACR1234A1Z1" 
          />
          <Input 
            label="Phone Number" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            placeholder="+91 98765 43210" 
          />
          <Input 
            className="md:col-span-2"
            label="Email Address" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            placeholder="client@example.com" 
          />
          <TextArea
            className="md:col-span-2"
            label="Billing Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Full billing address..."
            rows={3}
          />
        </form>
      </Modal>
    </div>
  );
}
