import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Vyapaar Flow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#compliance" className="hover:text-slate-900 transition-colors">Compliance</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Log in</Link>
            <Link to="/signup" className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-all shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-6 inline-block border border-slate-200">
              Reliable Invoicing for Indian SMEs
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
              Professional GST Invoicing <br className="hidden md:block"/> Built for Modern Business
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Create compliant tax invoices, manage client receivables, and track inventory with a high-density workstation designed for speed and stability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-base font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2">
                Start Free Trial
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a href="#features" className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-base font-bold rounded-lg transition-all flex items-center justify-center">
                View Features
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "GST Compliance", desc: "Native support for CGST, SGST, IGST calculations and HSN code management.", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
              { title: "Client CRM", desc: "Keep detailed records of client GSTINs, addresses, and outstanding balances.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" },
              { title: "Inventory Sync", desc: "Real-time stock tracking that updates automatically as invoices are finalized.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Built for speed.<br/>Verified for compliance.</h2>
            <p className="text-slate-500 mb-8 font-medium text-lg leading-relaxed">
              Stop fighting with spreadsheets and outdated software. Vyapaar Flow provides a high-density workspace that automates the complex parts of Indian tax billing.
            </p>
            <ul className="space-y-4">
              {['Automated IGST vs CGST/SGST Logic', 'Professional PDF Generation', 'Real-time Receivables Tracking'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-semibold text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Taxable Value</span>
                <span className="font-mono font-bold text-slate-700">₹ 45,000.00</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500">CGST (9%)</span>
                <span className="font-mono text-sm text-slate-600">₹ 4,050.00</span>
              </div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                <span className="text-sm font-semibold text-slate-500">SGST (9%)</span>
                <span className="font-mono text-sm text-slate-600">₹ 4,050.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Grand Total</span>
                <span className="font-mono text-xl font-bold text-slate-900">₹ 53,100.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple pricing for growing teams.</h2>
          <p className="text-slate-500 mb-12 font-medium">Free for starters, scalable for professionals.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-2">Starter</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-900">₹0</span>
                <span className="text-slate-400 font-semibold mb-1">/ mo</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-600 font-medium text-sm">
                <li>• Up to 10 invoices / month</li>
                <li>• Basic CRM & Inventory</li>
                <li>• Standard PDF Exports</li>
              </ul>
              <Link to="/signup" className="block w-full py-2.5 text-center border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-all">Get Started</Link>
            </div>
            
            <div className="bg-slate-900 text-white rounded-xl p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-white/10 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-white/10">Popular</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Professional</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold">₹499</span>
                <span className="text-slate-400 font-semibold mb-1">/ mo</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-300 font-medium text-sm">
                <li>• Unlimited Invoices</li>
                <li>• Advanced Analytics</li>
                <li>• Priority Support</li>
                <li>• Multi-user Access</li>
              </ul>
              <Link to="/signup" className="block w-full py-2.5 text-center bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-all">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">Vyapaar Flow</span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            © 2026 Vyapaar Flow. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
