import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-black tracking-tight">Vyapaar Flow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#why" className="hover:text-white transition-colors">Why Us</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block">Log in</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-500/25">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Vyapaar Flow 2.0 is Live
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
              AI-Powered GST Billing & <br className="hidden md:block"/> Business OS for Indian SMEs
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
              Create professional tax invoices, track inventory, and manage clients from a single, high-density workstation. Powered by AI, designed for scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-black rounded-xl transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2">
                Start for free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center">
                Explore Features
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-2 sm:p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2426&q=80" alt="Vyapaar Flow Dashboard Interface" className="rounded-xl w-full h-auto object-cover border border-white/5 opacity-80" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold tracking-wide">Live GST Calculation Active</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Everything you need to run your business.</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">Built specifically for the Indian market, complying with all GST norms while remaining incredibly simple to use.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "GST Billing Engine", desc: "Native support for CGST, SGST, IGST, and HSN codes with live calculations.", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" },
              { title: "AI Invoice Generation", desc: "Type 'Website design 12k + GST' and watch the magic happen.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Client CRM", desc: "Manage your client base, track outstandings, and auto-fill GSTIN details.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { title: "Inventory Management", desc: "Track products and services. Auto-pull pricing and HSN directly into invoices.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
              { title: "Advanced Analytics", desc: "Monitor revenue trends, outstanding payments, and client value over time.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { title: "Drafts & History", desc: "Save your work mid-way. Access full historical records of all generated bills.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
            ].map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-slate-800/30 border border-white/5 rounded-2xl p-8 hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feat.icon} /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className="py-24 px-6 bg-slate-800/20 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Built for speed.<br/>Designed for compliance.</h2>
            <p className="text-slate-400 mb-8 font-medium text-lg leading-relaxed">
              Traditional ERPs are clunky and complex. Spreadsheets are error-prone and unprofessional. Vyapaar Flow brings a modern, startup-grade experience to standard Indian GST billing.
            </p>
            <ul className="space-y-4">
              {['Lightning fast 2-column layout', 'Automated tax math (IGST vs CGST/SGST)', 'Export to pixel-perfect PDFs'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-bold text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 z-0"></div>
            <div className="relative z-10 bg-slate-900 rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Taxable Value</span>
                <span className="font-mono font-bold text-slate-300">₹ 45,000.00</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-400">CGST (9%)</span>
                <span className="font-mono text-sm text-slate-300">₹ 4,050.00</span>
              </div>
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <span className="text-sm font-bold text-slate-400">SGST (9%)</span>
                <span className="font-mono text-sm text-slate-300">₹ 4,050.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">Grand Total</span>
                <span className="font-mono text-xl font-black text-indigo-400">₹ 53,100.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Simple, transparent pricing.</h2>
          <p className="text-slate-400 mb-12 font-medium text-lg">Start for free, upgrade when your business scales.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-8">
              <h3 className="text-2xl font-black mb-2">Starter</h3>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black">₹0</span>
                <span className="text-slate-400 font-bold mb-1">/ forever</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-300 font-medium text-sm">
                <li>✓ 10 Invoices per month</li>
                <li>✓ Standard PDF Export</li>
                <li>✓ Basic Analytics</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all">Get Started</Link>
            </div>
            
            <div className="bg-indigo-600 rounded-2xl p-8 relative shadow-[0_0_40px_rgba(79,70,229,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-900 text-indigo-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-400/30">Most Popular</div>
              <h3 className="text-2xl font-black mb-2">Pro</h3>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black">₹499</span>
                <span className="text-indigo-200 font-bold mb-1">/ month</span>
              </div>
              <ul className="space-y-3 mb-8 text-indigo-50 font-medium text-sm">
                <li>✓ Unlimited Invoices</li>
                <li>✓ AI Generation Engine</li>
                <li>✓ Full CRM & Inventory</li>
                <li>✓ Priority Support</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center bg-white text-indigo-900 rounded-xl font-black hover:bg-indigo-50 transition-all">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Ready to professionalize your billing?</h2>
          <Link to="/signup" className="inline-flex px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-black rounded-xl transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] items-center justify-center gap-2">
            Create Your Account
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-sm font-black tracking-tight text-white">Vyapaar Flow</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            © 2026 Vyapaar Flow. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
