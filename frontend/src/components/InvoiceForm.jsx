import React, { useState, useEffect } from 'react';
import { fetchClients, fetchProducts } from '../api';

// Sub-components
import DocumentInfo from './invoice-form/DocumentInfo';
import BillingDetails from './invoice-form/BillingDetails';
import InvoiceItems from './invoice-form/InvoiceItems';
import PaymentSection from './invoice-form/PaymentSection';

const InvoiceForm = ({
  data, updateField, updateItem, addItem, removeItem,
  aiPrompt, setAiPrompt, isGenerating, handleAiGenerate
}) => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadSelectionData();
  }, []);

  const loadSelectionData = async () => {
    try {
      const [cData, pData] = await Promise.all([fetchClients(), fetchProducts()]);
      setClients(cData);
      setProducts(pData);
    } catch (err) {
      console.error('Failed to load selection data:', err);
    }
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      updateField('clientName', client.name);
      updateField('clientEmail', client.email || '');
      updateField('clientAddress', client.address || '');
      updateField('clientId', client.id);
      updateField('clientGstin', client.gstin || '');
    }
  };

  const handleProductSelect = (itemId, productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateItem(itemId, 'description', product.name);
      updateItem(itemId, 'rate', product.unitPrice);
      updateItem(itemId, 'hsn', product.hsn || '');
      updateItem(itemId, 'gstSlab', product.gstSlab || 18);
      updateItem(itemId, 'productId', product.id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DocumentInfo data={data} updateField={updateField} />
      
      <BillingDetails 
        data={data} 
        updateField={updateField} 
        clients={clients} 
        handleClientSelect={handleClientSelect} 
      />

      <InvoiceItems 
        data={data} 
        updateItem={updateItem} 
        addItem={addItem} 
        removeItem={removeItem}
        products={products}
        handleProductSelect={handleProductSelect}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        isGenerating={isGenerating}
        handleAiGenerate={handleAiGenerate}
      />

      <PaymentSection data={data} updateField={updateField} />
    </div>
  );
};

export default InvoiceForm;
