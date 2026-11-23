import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_SLOTS,
  INITIAL_BOOKINGS,
  INITIAL_REPORTS,
  DEFAULT_USER_LOCATION
} from '../data/mockData';
import {
  calculateDistanceKm,
  calculateEtaMinutes,
  calculateWalkingTimeMinutes,
  reverseGeocode,
  generateNearbySlotsForLocation
} from '../utils/geoUtils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User Authentication State - default to null so login/register page opens first
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('myspot_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active Role: 'seeker' | 'owner'
  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem('myspot_active_role');
    return saved || (user?.role === 'owner' ? 'owner' : 'seeker');
  });

  // User Coordinates & Geolocation
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);

  // Parking Slots Data - dynamically updated based on user coordinates & owner listings
  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem('myspot_slots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return generateNearbySlotsForLocation(DEFAULT_USER_LOCATION.lat, DEFAULT_USER_LOCATION.lng, INITIAL_SLOTS);
  });

  // Bookings List
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('myspot_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Seeker Reports & Issue logs
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('myspot_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // Host Reports (Owner reporting problematic seekers)
  const [hostReports, setHostReports] = useState(() => {
    const saved = localStorage.getItem('myspot_host_reports');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'HREP-101',
            seekerName: 'Aditya Verma',
            vehiclePlate: 'KA 05 NZ 1102',
            slotName: 'Cyber Heights Smart Multi-Level Hub',
            bayNumber: 'BAY A-02',
            issueCategory: 'Overstayed without payment',
            description: 'Vehicle parked for 4 extra hours after pass expiry and blocked access lane.',
            status: 'Resolved',
            date: '2026-08-18',
            actionTaken: 'Fined ₹200 and warning issued to seeker profile.'
          }
        ];
  });

  // UI Navigation Tabs
  // Seeker tabs: 'home' | 'slots' | 'report'
  const [activeTab, setActiveTab] = useState('home');

  // Host tabs: 'home' | 'slots' | 'revenue' | 'report'
  const [hostActiveTab, setHostActiveTab] = useState('home');

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('register'); // 'login' | 'register'
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeBookingForPass, setActiveBookingForPass] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHostSidebarOpen, setIsHostSidebarOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [isAddNewSpaceModalOpen, setIsAddNewSpaceModalOpen] = useState(false);
  const [isHostProfileModalOpen, setIsHostProfileModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all'); // 'all' | 'car' | 'bike'
  const [onlyCctv, setOnlyCctv] = useState(false);
  const [onlyEv, setOnlyEv] = useState(false);
  const [priceSort, setPriceSort] = useState('default'); // 'default' | 'asc' | 'desc' | 'rating'

  // Notifications / Toast
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Welcome to myspot!',
      message: 'Find nearby verified parking slots with ease.',
      time: 'Just now',
      read: false,
    }
  ]);
  const [toastMessage, setToastMessage] = useState(null);

  // Persist State to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('myspot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('myspot_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('myspot_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('myspot_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('myspot_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('myspot_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('myspot_host_reports', JSON.stringify(hostReports));
  }, [hostReports]);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Update slots whenever user coordinates change
  const updateUserCoordinates = async (lat, lng, customAddress = null) => {
    setIsLocating(true);
    let address = customAddress;
    if (!address) {
      address = await reverseGeocode(lat, lng);
    }
    const newLoc = { lat, lng, address };
    setUserLocation(newLoc);
    setIsLocating(false);

    // Update all slots with real distance from new user location
    setSlots(prev => {
      return prev.map(s => {
        const dist = calculateDistanceKm(lat, lng, s.lat, s.lng);
        return {
          ...s,
          distanceKm: dist,
          drivingEtaMins: calculateEtaMinutes(dist),
          walkingTimeMins: calculateWalkingTimeMinutes(dist),
        };
      });
    });
  };

  // Trigger Browser Geolocation
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'warning');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await updateUserCoordinates(latitude, longitude);
        setIsLiveGpsActive(true);
        showToast('📍 Live GPS location & routes updated!', 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('Using default central pin. Tap GPS button to retry.', 'info');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Automatically request user's live coordinates on initial login
  useEffect(() => {
    if (user && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await updateUserCoordinates(pos.coords.latitude, pos.coords.longitude);
          setIsLiveGpsActive(true);
        },
        () => {},
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  }, [user]);

  // Register New Slot Seeker (Personal + Vehicle)
  const registerUser = (personalData, vehicleData) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: personalData.name,
      email: personalData.email,
      phone: personalData.phone,
      isPhoneVerified: true,
      aadhaar: personalData.aadhaar,
      isAadhaarVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'seeker',
      walletBalance: 500,
      registeredVehicles: [
        {
          id: `veh_${Date.now()}`,
          type: vehicleData.type,
          modelName: vehicleData.modelName || (vehicleData.type === 'car' ? 'Sedan / SUV' : 'Motorbike'),
          plateNumber: vehicleData.plateNumber.toUpperCase(),
          licenseImage: vehicleData.licenseImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
          hasInsurance: !!vehicleData.insuranceNumber,
          insuranceNumber: vehicleData.insuranceNumber || 'Not specified',
          isPrimary: true,
        }
      ]
    };
    setUser(newUser);
    setActiveRole('seeker');
    setIsAuthModalOpen(false);
    showToast(`🎉 Welcome to myspot, ${newUser.name}!`, 'success');
  };

  // Register New Slot Seller / Host (Personal + Land Verification + CCTV Subscription)
  const registerOwner = (personalData, landData) => {
    const newOwner = {
      id: `host_${Date.now()}`,
      name: personalData.name,
      email: personalData.email,
      phone: personalData.phone,
      isPhoneVerified: true,
      aadhaar: personalData.aadhaar,
      isAadhaarVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'owner',
      payoutUpi: `${personalData.phone.replace(/\D/g, '')}@okaxis`,
      bankAccount: 'HDFC0001842 •••• 7892',
      cctvSubscriptionActive: !!landData.hasCctvSubscription,
      cctvPlanName: landData.hasCctvSubscription ? 'myspot AI Smart Sentinel 24/7' : 'Self-Monitored',
      managedSpaces: []
    };

    // Generate dynamic bays
    const totalBays = Number(landData.totalSlots || 6);
    const generatedBays = Array.from({ length: totalBays }, (_, i) => ({
      id: `BAY-${String.fromCharCode(65 + Math.floor(i / 10))}-${String((i % 10) + 1).padStart(2, '0')}`,
      type: i % 3 === 0 ? 'bike' : 'car',
      isOccupied: false,
    }));

    const newSlot = {
      id: `slot_host_${Date.now()}`,
      ownerId: newOwner.id,
      ownerName: newOwner.name,
      ownerPhone: newOwner.phone,
      name: landData.name || `${newOwner.name.split(' ')[0]}'s Smart Parking Space`,
      address: landData.address || userLocation.address,
      lat: Number(landData.lat || userLocation.lat + 0.002),
      lng: Number(landData.lng || userLocation.lng + 0.002),
      totalSlots: totalBays,
      availableSlots: totalBays,
      pricePerHour: Number(landData.pricePerHour || 40),
      allowedVehicles: landData.allowedVehicles || ['car', 'bike'],
      hasCctv: !!landData.hasCctvSubscription || !!landData.hasCctv,
      cctvBadgeText: landData.hasCctvSubscription ? 'AI Smart CCTV 24/7' : 'CCTV Monitored',
      hasEvCharging: !!landData.hasEvCharging,
      isCovered: !!landData.isCovered,
      rating: 5.0,
      reviewsCount: 1,
      distanceKm: 0.3,
      drivingEtaMins: 2,
      walkingTimeMins: 4,
      landPhotoProof: landData.landPhotoProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      images: [
        landData.slotPhoto || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=80'
      ],
      features: [
        'Verified Land Ownership Deed',
        landData.hasCctvSubscription ? 'myspot AI 24/7 Sentinel CCTV' : 'Owner Supervised',
        'Direct Boom Barrier Entry',
        '24/7 Security Guard On-Premise',
        'Covered Asphalt Bay Parking'
      ],
      bays: generatedBays,
      createdAt: new Date().toISOString()
    };

    newOwner.managedSpaces = [newSlot.id];

    // Update state & store in slots so Slot Seekers can immediately find & book it!
    setSlots(prev => [newSlot, ...prev]);
    setUser(newOwner);
    setActiveRole('owner');
    setHostActiveTab('home');

    showToast(`🎉 Land Space "${newSlot.name}" registered & published live to Slot Seekers!`, 'success');
  };

  // Add additional parking space as a host
  const addNewHostSpace = (landData) => {
    if (!user) return;

    const totalBays = Number(landData.totalSlots || 8);
    const generatedBays = Array.from({ length: totalBays }, (_, i) => ({
      id: `BAY-${String.fromCharCode(65 + Math.floor(i / 10))}-${String((i % 10) + 1).padStart(2, '0')}`,
      type: i % 3 === 0 ? 'bike' : 'car',
      isOccupied: false,
    }));

    const newSlot = {
      id: `slot_host_${Date.now()}`,
      ownerId: user.id,
      ownerName: user.name,
      ownerPhone: user.phone,
      name: landData.name,
      address: landData.address,
      lat: Number(landData.lat || userLocation.lat + (Math.random() - 0.5) * 0.005),
      lng: Number(landData.lng || userLocation.lng + (Math.random() - 0.5) * 0.005),
      totalSlots: totalBays,
      availableSlots: totalBays,
      pricePerHour: Number(landData.pricePerHour || 40),
      allowedVehicles: landData.allowedVehicles || ['car', 'bike'],
      hasCctv: !!landData.hasCctvSubscription || !!landData.hasCctv,
      cctvBadgeText: landData.hasCctvSubscription ? 'AI Sentinel CCTV 24/7' : 'CCTV Monitored',
      hasEvCharging: !!landData.hasEvCharging,
      isCovered: !!landData.isCovered,
      rating: 5.0,
      reviewsCount: 0,
      distanceKm: 0.5,
      drivingEtaMins: 3,
      walkingTimeMins: 6,
      landPhotoProof: landData.landPhotoProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      images: [
        landData.slotPhoto || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
      ],
      features: [
        'Verified Land Ownership Proof',
        'Direct RFID Boom Barrier Entry',
        '24/7 Security Guard',
        'Wide Bay Access'
      ],
      bays: generatedBays,
      createdAt: new Date().toISOString()
    };

    setSlots(prev => [newSlot, ...prev]);
    setIsAddNewSpaceModalOpen(false);
    showToast(`📍 New space "${newSlot.name}" is now live on myspot!`, 'success');
  };

  // Add vehicle for seeker
  const addVehicle = (vehicleData) => {
    if (!user) return;
    const newVeh = {
      id: `veh_${Date.now()}`,
      type: vehicleData.type,
      modelName: vehicleData.modelName || (vehicleData.type === 'car' ? 'Car' : 'Two Wheeler'),
      plateNumber: vehicleData.plateNumber.toUpperCase(),
      licenseImage: vehicleData.licenseImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
      hasInsurance: !!vehicleData.insuranceNumber,
      insuranceNumber: vehicleData.insuranceNumber || 'N/A',
      isPrimary: false,
    };
    const updatedUser = {
      ...user,
      registeredVehicles: [...(user.registeredVehicles || []), newVeh]
    };
    setUser(updatedUser);
    setIsNewVehicleModalOpen(false);
    showToast(`🚗 Vehicle ${newVeh.plateNumber} added successfully!`, 'success');
  };

  // Create a Booking (Sends real-time notification to the slot owner)
  const createBooking = ({
    slot,
    durationHours,
    vehiclePlate,
    vehicleType,
    isFriendBooking,
    friendDetails,
    paymentMethod,
  }) => {
    const rate = slot.pricePerHour;
    const baseAmount = rate * durationHours;
    const platformFee = 10;
    const tax = Math.round(baseAmount * 0.18 * 10) / 10;
    const totalAmount = baseAmount + platformFee + tax;

    // Choose available bay
    const freeBay = slot.bays.find(b => !b.isOccupied && (b.type === vehicleType || !b.type)) || slot.bays[0];
    const bayNumber = freeBay ? freeBay.id : 'BAY A-01';

    const newBooking = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      slotId: slot.id,
      slotName: slot.name,
      slotAddress: slot.address,
      slotImage: slot.images[0],
      ownerId: slot.ownerId || 'host_default',
      ownerName: slot.ownerName || 'Parking Host',
      bayNumber,
      vehiclePlate: isFriendBooking ? friendDetails.vehiclePlate : vehiclePlate,
      vehicleType,
      isFriendBooking,
      friendDetails: isFriendBooking ? friendDetails : null,
      driverName: isFriendBooking ? friendDetails?.name : (user?.name || 'Authorized Driver'),
      driverPhone: isFriendBooking ? friendDetails?.phone : (user?.phone || '+91 98765 43210'),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString(),
      durationHours,
      ratePerHour: rate,
      totalAmount,
      paymentMethod, // 'online' | 'offline'
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      bookingStatus: paymentMethod === 'online' ? 'confirmed' : 'hold',
      isCheckedIn: false,
      createdAt: new Date().toISOString(),
      hostApprovalPending: paymentMethod === 'offline',
    };

    // Update slot capacity
    setSlots(prev => prev.map(s => {
      if (s.id === slot.id) {
        return {
          ...s,
          availableSlots: Math.max(0, s.availableSlots - 1),
          bays: s.bays.map(b => b.id === bayNumber ? { ...b, isOccupied: true } : b)
        };
      }
      return s;
    }));

    setBookings(prev => [newBooking, ...prev]);

    // Send real-time notification to host
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: paymentMethod === 'online' ? '🔔 New Confirmed Booking!' : '⏳ Offline Hold Request Received',
        message: `Seeker ${newBooking.driverName} reserved ${bayNumber} at "${slot.name}" (${newBooking.vehiclePlate}).`,
        time: 'Just now',
        read: false,
      },
      ...prev
    ]);

    if (paymentMethod === 'online') {
      showToast('🎉 Booking Confirmed! Digital pass is ready.', 'success');
      setActiveBookingForPass(newBooking);
    } else {
      showToast('⏳ Slot Placed on HOLD! Awaiting Owner Confirmation.', 'warning');
    }

    return newBooking;
  };

  // Host Approves Offline Booking
  const approveHoldBooking = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          hostApprovalPending: false,
          approvedAt: new Date().toISOString(),
        };
      }
      return b;
    }));

    showToast(`✅ Booking ${bookingId} approved! Digital QR Pass generated for seeker.`, 'success');
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: '🎉 Booking Approved by Owner!',
        message: `Reservation ${bookingId} is now CONFIRMED. Seeker has received the QR entry pass.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Host Rejects Offline Booking
  const rejectHoldBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          bookingStatus: 'cancelled',
          hostApprovalPending: false,
          rejectedReason: 'Slot occupied by walk-in or maintenance',
        };
      }
      return b;
    }));

    // Free bay
    if (booking) {
      setSlots(prev => prev.map(s => {
        if (s.id === booking.slotId) {
          return {
            ...s,
            availableSlots: Math.min(s.totalSlots, s.availableSlots + 1),
            bays: s.bays.map(b => b.id === booking.bayNumber ? { ...b, isOccupied: false } : b)
          };
        }
        return s;
      }));
    }

    showToast(`❌ Booking ${bookingId} declined.`, 'info');
  };

  // Host Checks in Vehicle
  const checkInVehicle = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, isCheckedIn: true, checkInTime: new Date().toISOString() };
      }
      return b;
    }));
    showToast(`🚗 Vehicle checked in at parking lot!`, 'success');
  };

  // Host Checks out Vehicle (Frees the bay)
  const checkOutVehicle = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, isCheckedIn: false, checkOutTime: new Date().toISOString(), bookingStatus: 'completed' };
      }
      return b;
    }));

    // Free bay
    setSlots(prev => prev.map(s => {
      if (s.id === booking.slotId) {
        return {
          ...s,
          availableSlots: Math.min(s.totalSlots, s.availableSlots + 1),
          bays: s.bays.map(b => b.id === booking.bayNumber ? { ...b, isOccupied: false } : b)
        };
      }
      return s;
    }));

    showToast(`🏁 Vehicle checked out. Bay ${booking.bayNumber} is now free for new bookings!`, 'success');
  };

  // Cancel an active booking (by seeker)
  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b));

    // Release bay
    setSlots(prev => prev.map(s => {
      if (s.id === booking.slotId) {
        return {
          ...s,
          availableSlots: Math.min(s.totalSlots, s.availableSlots + 1),
          bays: s.bays.map(b => b.id === booking.bayNumber ? { ...b, isOccupied: false } : b)
        };
      }
      return s;
    }));

    showToast('Booking cancelled. Any refund has been credited to your wallet.', 'info');
  };

  // Seeker Report
  const submitReport = (reportData) => {
    const newReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      issueType: reportData.issueType,
      slotName: reportData.slotName,
      date: new Date().toISOString().split('T')[0],
      status: 'In Review',
      description: reportData.description,
      photoUrl: reportData.photoUrl || null,
      resolution: 'Our Smart Operations team is reviewing this case.'
    };
    setReports(prev => [newReport, ...prev]);
    showToast('🛡️ Report submitted! Ticket ID: ' + newReport.id, 'success');
  };

  // Host Report (Owner reporting seeker misconduct)
  const submitHostReport = (reportData) => {
    const newReport = {
      id: `HREP-${Math.floor(100 + Math.random() * 900)}`,
      seekerName: reportData.seekerName || 'Slot Seeker',
      vehiclePlate: reportData.vehiclePlate?.toUpperCase() || 'UNKNOWN',
      slotName: reportData.slotName || 'Managed Parking Hub',
      bayNumber: reportData.bayNumber || 'BAY A-01',
      issueCategory: reportData.issueCategory,
      description: reportData.description,
      photoUrl: reportData.photoUrl || null,
      status: 'In Review',
      date: new Date().toISOString().split('T')[0],
      actionTaken: 'Our Ground Enforcement & Security team is reviewing this report.'
    };

    setHostReports(prev => [newReport, ...prev]);
    showToast(`🚨 Seeker Report filed against ${newReport.vehiclePlate}! Ticket: ${newReport.id}`, 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeRole,
        setActiveRole,
        slots,
        setSlots,
        userLocation,
        setUserLocation,
        isLocating,
        isLiveGpsActive,
        requestUserLocation,
        updateUserCoordinates,
        bookings,
        reports,
        hostReports,
        activeTab,
        setActiveTab,
        hostActiveTab,
        setHostActiveTab,
        selectedSlot,
        setSelectedSlot,
        activeBookingForPass,
        setActiveBookingForPass,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isSidebarOpen,
        setIsSidebarOpen,
        isHostSidebarOpen,
        setIsHostSidebarOpen,
        isSupportModalOpen,
        setIsSupportModalOpen,
        isNewVehicleModalOpen,
        setIsNewVehicleModalOpen,
        isOwnerDashboardOpen,
        setIsOwnerDashboardOpen,
        isAddNewSpaceModalOpen,
        setIsAddNewSpaceModalOpen,
        isHostProfileModalOpen,
        setIsHostProfileModalOpen,
        searchQuery,
        setSearchQuery,
        vehicleFilter,
        setVehicleFilter,
        onlyCctv,
        setOnlyCctv,
        onlyEv,
        setOnlyEv,
        priceSort,
        setPriceSort,
        notifications,
        setNotifications,
        toastMessage,
        showToast,
        registerUser,
        registerOwner,
        addNewHostSpace,
        addVehicle,
        createBooking,
        approveHoldBooking,
        rejectHoldBooking,
        checkInVehicle,
        checkOutVehicle,
        cancelBooking,
        submitReport,
        submitHostReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
