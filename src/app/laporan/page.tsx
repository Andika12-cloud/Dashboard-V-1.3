'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { ReportView } from '../../components/report/ReportView';

export default function LaporanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab="laporan"
        setActiveTab={() => {}}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isRefreshing={false}
          onRefresh={() => {}}
          onExportClick={() => {}}
        />

        <main className="flex-1 overflow-y-auto w-full min-h-screen px-4 md:px-6 lg:px-8 py-6 space-y-6">
          <ReportView 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onNavigateDashboard={() => { window.location.href = '/'; }} 
          />
        </main>
      </div>
    </div>
  );
}
