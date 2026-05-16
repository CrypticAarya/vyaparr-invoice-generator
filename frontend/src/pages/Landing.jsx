import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FloatingCard from '../ui/FloatingCard';

const Landing = () => {
  return (
    <div className="min-h-screen bg-v-bg text-v-text selection:bg-v-accent selection:text-white overflow-x-hidden">
      
      {/* Premium Glass Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-black/[0.03] bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-v-accent rounded-xl flex items-center justify-center shadow-lg shadow-v-accent/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-v-text kalam">VyapaarFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-bold text-zinc-500">
            <a href="#features" className="hover:text-v-accent transition-colors">Features</a>
            <a href="#compliance" className="hover:text-v-accent transition-colors">Compliance</a>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[13px] font-bold text-zinc-500 hover:text-v-text transition-colors">Log in</Link>
            <Link to="/signup" className="btn-premium btn-premium-primary px-6 py-2.5 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section — The "Operating System" Feel */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="px-4 py-1.5 rounded-full bg-v-lavender text-v-accent text-[11px] font-bold uppercase tracking-widest mb-8 inline-block border border-v-accent/10 shadow-sm">
              The AI-Native Finance Operating System
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-v-text text-balance">
              Professional Invoicing <br />
              <span className="text-v-accent sketch-title italic">Built for Modern Teams</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Automate GST compliance, track every rupee, and let AI optimize your cashflow. 
              Designed for speed, built for stability.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/signup" className="w-full sm:w-auto px-10 py-4 bg-v-accent hover:scale-105 text-white text-base font-bold rounded-2xl transition-all shadow-xl shadow-v-accent/20 flex items-center justify-center gap-3">
                Get Started For Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a href="#features" className="w-full sm:w-auto px-10 py-4 bg-white/60 hover:bg-white border border-black/[0.05] text-v-text text-base font-bold rounded-2xl transition-all flex items-center justify-center">
                Explore Workstation
              </a>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Floating Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-visible hidden xl:block">
          <FloatingCard className="top-[20%] left-[8%] w-60" bgColor="bg-v-mint" rotation={-5} delay={0.2}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Inventory Sync</p>
              <p className="text-xl font-bold text-v-text">Automated <span className="kalam text-sm">Real-time</span></p>
            </div>
          </FloatingCard>

          <FloatingCard className="top-[25%] right-[10%] w-64" bgColor="bg-v-sky" rotation={8} delay={0.4}>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Compliance</p>
                <p className="text-lg font-bold text-v-text">100% GST Ready</p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard className="bottom-[15%] left-[12%] w-56" bgColor="bg-v-lavender" rotation={-3} delay={0.6}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-v-accent uppercase tracking-widest">AI CFO</p>
              <p className="text-lg font-bold text-v-text italic kalam">Cashflow predicted</p>
            </div>
          </FloatingCard>

          <FloatingCard className="bottom-[10%] right-[15%] w-60" bgColor="bg-v-peach" rotation={4} delay={0.8}>
             <div className="space-y-1 text-center">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-bold text-v-text">₹1.2M <span className="text-xs text-orange-400">in pipeline</span></p>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* High-Density Features Grid */}
      <section id="features" className="py-32 px-6 bg-white/40 border-y border-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight kalam">Engineered for Excellence</h2>
            <p className="text-zinc-500 font-medium max-w-xl mx-auto">Every tool you need to run your modern enterprise, built into a single cohesive workstation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "GST Compliance", color: "v-lavender", desc: "Native support for CGST, SGST, IGST calculations and HSN code management.", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
              { title: "Client CRM", color: "v-mint", desc: "Keep detailed records of client GSTINs, addresses, and outstanding balances with ease.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" },
              { title: "Inventory Ledger", color: "v-sky", desc: "Atomic stock tracking with a detailed transaction history for every single product.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className={`bg-${feat.color}/30 border border-black/[0.02] rounded-[32px] p-10 transition-all hover:shadow-xl hover:shadow-black/5`}
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <svg className="w-7 h-7 text-v-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                <p className="text-zinc-500 text-base font-medium leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Compliance Section */}
      <section id="compliance" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:row items-center gap-20">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Built for speed. <br />
              <span className="text-v-accent italic sketch-title">Verified for compliance.</span>
            </h2>
            <p className="text-xl text-zinc-500 font-medium leading-relaxed">
              Stop fighting with spreadsheets and outdated software. VyapaarFlow provides a high-density workspace that automates the complex parts of Indian tax billing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                'Automated IGST Logic', 
                'Professional PDF Engine', 
                'Real-time AR Tracking',
                'Bulk Import/Export'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl border border-black/[0.02]">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-bold text-v-text">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="absolute -inset-4 bg-v-accent/5 blur-3xl rounded-full" />
            <div className="relative premium-card p-10 bg-white/80 border-black/[0.05] backdrop-blur-xl">
               <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-black/5 pb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Transaction Value</span>
                  <span className="text-2xl font-black text-v-text kalam">₹ 45,000.00</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold text-zinc-500">
                    <span>CGST (9%)</span>
                    <span>₹ 4,050.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-zinc-500 border-b border-black/5 pb-6">
                    <span>SGST (9%)</span>
                    <span>₹ 4,050.00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-v-text">Grand Total</span>
                  <span className="text-3xl font-black text-v-accent">₹ 53,100.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Pricing Cards */}
      <section className="py-32 px-6 bg-v-lavender/20 border-t border-black/[0.02]">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-black kalam">Powerful. Professional. <br /><span className="text-v-accent">Always Free.</span></h2>
          <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto italic">
            VyapaarFlow was built to empower modern entrepreneurs. We believe professional billing tools should be accessible to everyone, regardless of their scale.
          </p>
          
          <div className="premium-card p-12 bg-white border-black/[0.03] text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <svg className="w-64 h-64 text-v-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-v-text">Lifetime Free Access</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-600 font-bold text-sm">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-v-accent" /> Unlimited Invoices</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-v-accent" /> Unlimited Clients</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-v-accent" /> Full AI CFO Access</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-v-accent" /> Inventory Automation</li>
                </ul>
              </div>
              <Link to="/signup" className="btn-premium btn-premium-primary px-12 py-5 text-lg shadow-2xl shadow-v-accent/30">
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer experience */}
      <footer className="border-t border-black/[0.03] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-v-accent rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-v-text kalam">VyapaarFlow</span>
          </div>
          <div className="text-zinc-400 text-[13px] font-bold uppercase tracking-widest">
            © 2026 VYAPAARFLOW • Community Edition
          </div>
          <div className="flex items-center gap-10 text-[13px] font-bold text-zinc-400">
            <a href="#" className="hover:text-v-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-v-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
