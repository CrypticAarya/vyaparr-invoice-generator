import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import PageLoader from '../components/PageLoader';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen relative">
      {/* Sidebar - Controlled by Grid or absolute positioning in mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 relative p-4 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            <div className="max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
