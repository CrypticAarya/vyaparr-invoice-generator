import React, { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';

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

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // TanStack Query Hooks
  const { data: products = [], isLoading } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [formData, setFormData] = useState({
    name: '', hsn: '', unitPrice: '', gstSlab: 18, unit: 'PCS', description: '',
    stockQuantity: 0, lowStockThreshold: 5, isService: false
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ 
        ...product,
        stockQuantity: product.stockQuantity || 0,
        lowStockThreshold: product.lowStockThreshold || 5,
        isService: product.isService || false
      });
    } else {
      setEditingProduct(null);
      setFormData({ 
        name: '', hsn: '', unitPrice: '', gstSlab: 18, unit: 'PCS', description: '',
        stockQuantity: 0, lowStockThreshold: 5, isService: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mutation = editingProduct ? updateProductMutation : createProductMutation;
    
    mutation.mutate(
      editingProduct ? { id: editingProduct._id, data: formData } : formData,
      {
        onSuccess: () => setIsModalOpen(false),
      }
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.hsn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Inventory" 
        description="Manage your products, services, and pricing."
        actions={
          <>
            <div className="relative">
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" placeholder="Search inventory..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 outline-none w-64 transition-all"
              />
            </div>
            <Button onClick={() => handleOpenModal()} icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            )}>
              Add Item
            </Button>
          </>
        }
      />

      <Card noPadding>
        {isLoading ? (
          <div className="py-20"><PageLoader /></div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState 
            icon={(props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            title="Your inventory is empty"
            description="Add products or services to get started with fast invoice generation."
            actionText="Add First Item"
            onAction={() => handleOpenModal()}
          />
        ) : (
          <Table headers={['Product / Service', 'HSN/SAC', 'Stock Status', 'Price', 'Tax Slab', 'Actions']}>
            {(filteredProducts || []).map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-black text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-400 font-bold truncate max-w-xs">{p.description || 'No description'}</p>
                    </div>
                    {p.isService && <Badge variant="neutral">Service</Badge>}
                  </div>
                </TableCell>
                <TableCell className="font-black text-indigo-600 uppercase tracking-wider">{p.hsn || '-'}</TableCell>
                <TableCell>
                  {p.isService ? (
                    <span className="text-slate-400 font-bold text-xs">N/A</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <p className={`font-black ${p.stockQuantity <= 0 ? 'text-rose-500' : p.stockQuantity <= p.lowStockThreshold ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {p.stockQuantity} {p.unit || 'PCS'}
                      </p>
                      {p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0 && (
                        <Badge variant="warning" className="w-fit">Low Stock</Badge>
                      )}
                      {p.stockQuantity <= 0 && (
                        <Badge variant="error" className="w-fit">Out of Stock</Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-black text-slate-900">₹{(p.unitPrice || 0).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">per {p.unit || 'PCS'}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="warning">{p.gstSlab}% GST</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
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
        title={editingProduct ? 'Edit Item' : 'Add New Item'}
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            >
              {editingProduct ? 'Update Item' : 'Save Item'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            className="md:col-span-2"
            label="Item Name *" 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="e.g. Web Development Services" 
          />
          
          <div className="md:col-span-2 flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isService"
                checked={formData.isService}
                onChange={(e) => setFormData({...formData, isService: e.target.checked})}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="isService" className="text-sm font-bold text-slate-700">This is a Service (No Stock Tracking)</label>
            </div>
          </div>

          <Input 
            label="HSN/SAC Code" 
            value={formData.hsn} 
            onChange={(e) => setFormData({...formData, hsn: e.target.value})} 
            placeholder="e.g. 9983" 
          />
          <Input 
            label="Unit (e.g. PCS, HRS, NOS)" 
            value={formData.unit} 
            onChange={(e) => setFormData({...formData, unit: e.target.value})} 
            placeholder="PCS" 
          />
          
          {!formData.isService && (
            <>
              <Input 
                label="Initial Stock Quantity" 
                type="number" 
                value={formData.stockQuantity} 
                onChange={(e) => setFormData({...formData, stockQuantity: Number(e.target.value)})} 
                placeholder="0" 
              />
              <Input 
                label="Low Stock Alert Threshold" 
                type="number" 
                value={formData.lowStockThreshold} 
                onChange={(e) => setFormData({...formData, lowStockThreshold: Number(e.target.value)})} 
                placeholder="5" 
              />
            </>
          )}

          <Input 
            label="Unit Price (Base) *" 
            type="number" 
            required 
            value={formData.unitPrice} 
            onChange={(e) => setFormData({...formData, unitPrice: e.target.value})} 
            placeholder="0.00" 
          />
          <div className="space-y-2">
            <label className="text-[13px] font-black text-slate-700 uppercase tracking-widest ml-1">GST Slab (%)</label>
            <select 
              value={formData.gstSlab} 
              onChange={(e) => setFormData({...formData, gstSlab: Number(e.target.value)})} 
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value={0}>0% (Exempt)</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>
          <TextArea 
            className="md:col-span-2"
            label="Description"
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            placeholder="Brief details about the product or service..." 
            rows={3}
          />
        </form>
      </Modal>
    </div>
  );
}
