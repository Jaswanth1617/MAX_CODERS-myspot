import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Seeker (Driver) Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { HomePage } from './components/home/HomePage';
import { MySlotsPage } from './components/slots/MySlotsPage';
import { ReportPage } from './components/report/ReportPage';
import { AuthPage } from './components/auth/AuthPage';
import { RegisterModal } from './components/auth/RegisterModal';
import { NewVehicleModal } from './components/vehicle/NewVehicleModal';
import { OwnerDashboardModal } from './components/owner/OwnerDashboardModal';
import { DigitalPassModal } from './components/booking/DigitalPassModal';
import { CustomerServiceModal } from './components/support/CustomerServiceModal';
import { PassVerificationModal } from './components/booking/PassVerificationModal';

// Host (Owner / Space Seller) Components
import { HostHeader } from './components/host/HostHeader';
import { HostSidebar } from './components/host/HostSidebar';
import { HostBottomNav } from './components/host/HostBottomNav';
import { HostHomePage } from './components/host/HostHomePage';
import { HostSlotsPage } from './components/host/HostSlotsPage';
import { HostRevenuePage } from './components/host/HostRevenuePage';
import { HostReportPage } from './components/host/HostReportPage';
import { AddNewSpaceModal } from './components/host/AddNewSpaceModal';
import { HostProfileModal } from './components/host/HostProfileModal';

const AppContent = () => {
  const {
    user,
    activeRole,
    activeTab,
    hostActiveTab,
    bookings,
    approveHoldBooking
  } = useApp();

  // QR Code URL scanner data (detects ?verifyPass=BKG-1234 across any mobile or scanner device)
  const [scannedPassData, setScannedPassData] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const verifyPassId = searchParams.get('verifyPass') || searchParams.get('pass');

    if (verifyPassId) {
      const matched = bookings.find((b) => b.id === verifyPassId);

      const slot = searchParams.get('slot') || matched?.slotName || 'Cyber Heights Smart Multi-Level Hub';
      const address = searchParams.get('address') || matched?.slotAddress || '100 Feet Road, Indiranagar';
      const bay = searchParams.get('bay') || matched?.bayNumber || 'BAY A-04';
      const plate = searchParams.get('plate') || matched?.vehiclePlate || 'KA 03 MG 7821';
      const type = searchParams.get('type') || matched?.vehicleType || 'car';
      const status = searchParams.get('status') || matched?.bookingStatus || 'confirmed';
      const dur = searchParams.get('dur') || matched?.durationHours || 2;
      const total = searchParams.get('total') || matched?.totalAmount || 104.4;
      const method = searchParams.get('method') || matched?.paymentMethod || 'online';
      const driver = searchParams.get('driver') || matched?.driverName || 'Rohit Sharma';
      const phone = searchParams.get('phone') || matched?.driverPhone || '+91 98765 43210';
      const created = searchParams.get('created') || matched?.createdAt || new Date().toISOString();

      setScannedPassData({
        id: verifyPassId,
        slotName: slot,
        slotAddress: address,
        bayNumber: bay,
        vehiclePlate: plate,
        vehicleType: type,
        bookingStatus: status,
        paymentStatus: status === 'confirmed' ? 'paid' : 'pending',
        durationHours: Number(dur),
        totalAmount: Number(total),
        paymentMethod: method,
        driver,
        phone,
        createdAt: created
      });
    }
  }, [bookings]);

  const handleCloseScannedModal = () => {
    setScannedPassData(null);
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // If user is not authenticated, show the Role Choice & Auth Page
  if (!user) {
    return (
      <>
        <AuthPage />
        <Toast />
        {scannedPassData && (
          <PassVerificationModal
            passData={scannedPassData}
            onClose={handleCloseScannedModal}
            onConfirmHold={(id) => approveHoldBooking(id)}
          />
        )}
      </>
    );
  }

  // ==========================================
  // HOST / OWNER DEDICATED VIEW (SLOT SELLER)
  // ==========================================
  if (activeRole === 'owner') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FE] text-[#1E1B4B] selection:bg-purple-600 selection:text-white relative">
        {/* Host Application Header with top-right profile */}
        <HostHeader />

        {/* Host Slide Navigation Drawer */}
        <HostSidebar />

        {/* Host Main Page Router */}
        <main className="flex-1">
          {hostActiveTab === 'home' && <HostHomePage />}
          {hostActiveTab === 'slots' && <HostSlotsPage />}
          {hostActiveTab === 'revenue' && <HostRevenuePage />}
          {hostActiveTab === 'report' && <HostReportPage />}
        </main>

        {/* 3 Circular Floating Navigation Icons: Home, Slots, Revenue (positioned 10% above bottom) */}
        <HostBottomNav />

        {/* Host Modals */}
        <AddNewSpaceModal />
        <HostProfileModal />
        <CustomerServiceModal />
        <Toast />

        {/* Scanned QR Pass Modal */}
        {scannedPassData && (
          <PassVerificationModal
            passData={scannedPassData}
            onClose={handleCloseScannedModal}
            onConfirmHold={(id) => approveHoldBooking(id)}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // SLOT SEEKER DEDICATED VIEW (DRIVER)
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FE] text-[#1E1B4B] selection:bg-purple-600 selection:text-white relative">
      {/* Top Application Header */}
      <Header />

      {/* Slide Navigation Drawer */}
      <Sidebar />

      {/* Main Page Router */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'slots' && <MySlotsPage />}
        {activeTab === 'report' && <ReportPage />}
      </main>

      {/* 3 Circular Floating Navigation Icons: Home, Slot, Report (positioned 10% above bottom) */}
      <BottomNav />

      {/* Global Modals & Notifications */}
      <RegisterModal />
      <NewVehicleModal />
      <OwnerDashboardModal />
      <DigitalPassModal />
      <CustomerServiceModal />
      <Toast />

      {/* Scanned QR Pass Modal */}
      {scannedPassData && (
        <PassVerificationModal
          passData={scannedPassData}
          onClose={handleCloseScannedModal}
          onConfirmHold={(id) => approveHoldBooking(id)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
