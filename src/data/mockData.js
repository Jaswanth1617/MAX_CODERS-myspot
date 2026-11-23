// Mock database and preset dataset for myspot Smart Mobility App

export const INITIAL_USER = {
  id: 'usr_101',
  name: 'Rohit Sharma',
  email: 'rohit.sharma@myspot.app',
  phone: '+91 98765 43210',
  isPhoneVerified: true,
  aadhaar: '5489 1234 5678',
  isAadhaarVerified: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'seeker', // 'seeker' | 'owner'
  walletBalance: 850,
  registeredVehicles: [
    {
      id: 'veh_01',
      type: 'car',
      modelName: 'Hyundai Creta SX',
      plateNumber: 'KA 03 MG 7821',
      licenseImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
      hasInsurance: true,
      insuranceNumber: 'HDFC-ERGO-892102',
      isPrimary: true,
    },
    {
      id: 'veh_02',
      type: 'bike',
      modelName: 'Royal Enfield Hunter 350',
      plateNumber: 'KA 01 EK 4920',
      licenseImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
      hasInsurance: true,
      insuranceNumber: 'ICICI-LOMB-33214',
      isPrimary: false,
    }
  ]
};

// Default User coordinates (Bangalore Central Tech Hub by default, fallback coordinates)
export const DEFAULT_USER_LOCATION = {
  lat: 12.9716,
  lng: 77.5946,
  address: 'MG Road Metro Station, Bangalore'
};

export const INITIAL_SLOTS = [
  {
    id: 'slot_1',
    name: 'Cyber Heights Smart Multi-Level Plaza',
    address: '100ft Road, Indiranagar, Bangalore',
    lat: 12.9784,
    lng: 77.6408,
    distanceKm: 0.45,
    walkingTimeMins: 5,
    rating: 4.8,
    reviewsCount: 184,
    pricePerHour: 40,
    availableSlots: 3,
    totalSlots: 10,
    allowedVehicles: ['car', 'bike'],
    hasCctv: true,
    cctvBadgeText: '24/7 CCTV & Security Guard',
    hasEvCharging: true,
    isCovered: true,
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Automated Boom Barrier',
      'Dedicated EV Fast Chargers (60kW)',
      'Underground Covered Roof',
      'Security Guard On-Duty',
      'Valet Service Available'
    ],
    owner: {
      name: 'Vikram Rao (SuperHost)',
      phone: '+91 91234 56789',
      rating: 4.9,
    },
    bays: [
      { id: 'A-01', type: 'car', isOccupied: false },
      { id: 'A-02', type: 'car', isOccupied: true },
      { id: 'A-03', type: 'car', isOccupied: false },
      { id: 'A-04', type: 'car', isOccupied: true },
      { id: 'B-01', type: 'bike', isOccupied: false },
      { id: 'B-02', type: 'bike', isOccupied: true },
      { id: 'B-03', type: 'bike', isOccupied: true },
      { id: 'B-04', type: 'car', isOccupied: true },
      { id: 'C-01', type: 'car', isOccupied: true },
      { id: 'C-02', type: 'car', isOccupied: true },
    ]
  },
  {
    id: 'slot_2',
    name: 'Phoenix Grand Mall Basement Smart Slot',
    address: 'Whitefield Main Road, Mahadevapura, Bangalore',
    lat: 12.9961,
    lng: 77.6963,
    distanceKm: 1.2,
    walkingTimeMins: 14,
    rating: 4.9,
    reviewsCount: 312,
    pricePerHour: 50,
    availableSlots: 4,
    totalSlots: 15,
    allowedVehicles: ['car', 'bike'],
    hasCctv: true,
    cctvBadgeText: 'High-Res CCTV with AI Plate Scanner',
    hasEvCharging: true,
    isCovered: true,
    images: [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Direct Mall Elevator Access',
      'Wheelchair Accessible Bays',
      'Free Tire Air Pressure Check',
      'Covered Multi-Level Parking'
    ],
    owner: {
      name: 'Phoenix Mall Ops Ltd',
      phone: '+91 80 4962 6000',
      rating: 4.8,
    },
    bays: [
      { id: 'P1-10', type: 'car', isOccupied: false },
      { id: 'P1-11', type: 'car', isOccupied: false },
      { id: 'P1-12', type: 'car', isOccupied: false },
      { id: 'P1-13', type: 'bike', isOccupied: false },
      { id: 'P1-14', type: 'car', isOccupied: true },
    ]
  },
  {
    id: 'slot_3',
    name: 'Metro Transit Hub Express Parking',
    address: 'Opp. Trinity Metro Station, MG Road, Bangalore',
    lat: 12.9734,
    lng: 77.6178,
    distanceKm: 0.8,
    walkingTimeMins: 9,
    rating: 4.6,
    reviewsCount: 95,
    pricePerHour: 30,
    availableSlots: 6,
    totalSlots: 18,
    allowedVehicles: ['car', 'bike'],
    hasCctv: true,
    cctvBadgeText: '24/7 CCTV Monitored',
    hasEvCharging: false,
    isCovered: false,
    images: [
      'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Fast In-and-Out Highway Access',
      '24/7 Gate Guard Security',
      'Digital QR Check-in System',
      'Affordable Hourly & Daily Pass'
    ],
    owner: {
      name: 'BMRCL Partner Spots',
      phone: '+91 98877 66554',
      rating: 4.7,
    },
    bays: [
      { id: 'M-01', type: 'car', isOccupied: false },
      { id: 'M-02', type: 'car', isOccupied: false },
      { id: 'M-03', type: 'bike', isOccupied: false },
      { id: 'M-04', type: 'bike', isOccupied: false },
      { id: 'M-05', type: 'car', isOccupied: false },
      { id: 'M-06', type: 'car', isOccupied: false },
    ]
  },
  {
    id: 'slot_4',
    name: 'Koramangala 5th Block Premium SafePark',
    address: 'Near Sony World Junction, Koramangala, Bangalore',
    lat: 12.9352,
    lng: 77.6245,
    distanceKm: 2.1,
    walkingTimeMins: 22,
    rating: 4.9,
    reviewsCount: 240,
    pricePerHour: 45,
    availableSlots: 2,
    totalSlots: 12,
    allowedVehicles: ['car', 'bike'],
    hasCctv: true,
    cctvBadgeText: 'Full HD CCTV + Night Vision',
    hasEvCharging: true,
    isCovered: true,
    images: [
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Premium Wide SUV Parking Spots',
      'EV Type 2 AC Fast Charger',
      'Gated Private Compound with Security Guard',
      'Illuminated Pathway'
    ],
    owner: {
      name: 'Ananya Deshmukh',
      phone: '+91 94567 12345',
      rating: 4.9,
    },
    bays: [
      { id: 'K-01', type: 'car', isOccupied: false },
      { id: 'K-02', type: 'car', isOccupied: false },
      { id: 'K-03', type: 'car', isOccupied: true },
      { id: 'K-04', type: 'bike', isOccupied: true },
    ]
  },
  {
    id: 'slot_5',
    name: 'Brigade Tech Gardens Smart Parking Zone',
    address: 'ITPB Road, Kundalahalli, Brookefield, Bangalore',
    lat: 12.9698,
    lng: 77.7126,
    distanceKm: 3.5,
    walkingTimeMins: 38,
    rating: 4.7,
    reviewsCount: 160,
    pricePerHour: 35,
    availableSlots: 8,
    totalSlots: 25,
    allowedVehicles: ['car', 'bike'],
    hasCctv: true,
    cctvBadgeText: '24/7 CCTV & Monitored Gates',
    hasEvCharging: true,
    isCovered: true,
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Corporate Badge & QR Quick Access',
      'Double Basements with Ventilation',
      'Towing & Jumpstart Assistance Available',
    ],
    owner: {
      name: 'Brigade Facility Solutions',
      phone: '+91 80 4040 5050',
      rating: 4.8,
    },
    bays: [
      { id: 'BT-01', type: 'car', isOccupied: false },
      { id: 'BT-02', type: 'car', isOccupied: false },
      { id: 'BT-03', type: 'bike', isOccupied: false },
    ]
  },
  {
    id: 'slot_6',
    name: 'Church Street Bike & Compact Spot',
    address: 'Church Street, Off Brigade Road, Bangalore',
    lat: 12.9752,
    lng: 77.6045,
    distanceKm: 0.6,
    walkingTimeMins: 7,
    rating: 4.5,
    reviewsCount: 88,
    pricePerHour: 25,
    availableSlots: 5,
    totalSlots: 15,
    allowedVehicles: ['bike'],
    hasCctv: true,
    cctvBadgeText: 'CCTV Monitored Lot',
    hasEvCharging: false,
    isCovered: false,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Perfect for Two-Wheelers & Superbikes',
      'Direct walking entrance to Church Street cafes',
      'Safe helmet locker facility on-site'
    ],
    owner: {
      name: 'Ramesh G.',
      phone: '+91 97766 55443',
      rating: 4.6,
    },
    bays: [
      { id: 'BK-1', type: 'bike', isOccupied: false },
      { id: 'BK-2', type: 'bike', isOccupied: false },
      { id: 'BK-3', type: 'bike', isOccupied: false },
    ]
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'BKG-8932',
    slotId: 'slot_1',
    slotName: 'Cyber Heights Smart Multi-Level Plaza',
    slotAddress: '100ft Road, Indiranagar, Bangalore',
    slotImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    bayNumber: 'A-03',
    vehiclePlate: 'KA 03 MG 7821',
    vehicleType: 'car',
    isFriendBooking: false,
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    durationHours: 2,
    ratePerHour: 40,
    totalAmount: 94.4, // rate * 2 + platform fee (10) + gst (4.4)
    paymentMethod: 'online',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed', // 'confirmed' | 'hold' | 'completed' | 'cancelled'
    qrCodeText: 'MYSPOT-PASS-BKG8932-A03-KA03MG7821',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    hostApprovalPending: false,
  },
  {
    id: 'BKG-4190',
    slotId: 'slot_2',
    slotName: 'Phoenix Grand Mall Basement Smart Slot',
    slotAddress: 'Whitefield Main Road, Mahadevapura, Bangalore',
    slotImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
    bayNumber: 'P1-10',
    vehiclePlate: 'KA 05 NZ 1102',
    vehicleType: 'car',
    isFriendBooking: true,
    friendDetails: {
      name: 'Aditya Verma',
      phone: '+91 98450 12345',
      vehiclePlate: 'KA 05 NZ 1102',
    },
    startTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 195 * 60 * 1000).toISOString(),
    durationHours: 3,
    ratePerHour: 50,
    totalAmount: 177.0,
    paymentMethod: 'offline',
    paymentStatus: 'pending',
    bookingStatus: 'hold', // HOLD waiting for owner approval
    qrCodeText: 'MYSPOT-PASS-BKG4190-P110-KA05NZ1102',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    hostApprovalPending: true,
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'REP-101',
    issueType: 'Blocked Slot by Unauthorized Vehicle',
    slotName: 'Cyber Heights Smart Multi-Level Plaza',
    date: '2026-08-16',
    status: 'Resolved',
    description: 'Vehicle KA 01 HH 9988 parked across bay A-03 line.',
    resolution: 'Guard relocated offending vehicle within 10 minutes. ₹20 credit issued.'
  },
  {
    id: 'REP-102',
    issueType: 'EV Charger Offline',
    slotName: 'Phoenix Grand Mall Basement',
    date: '2026-08-12',
    status: 'Resolved',
    description: 'Charger unit #2 was showing error E04.',
    resolution: 'Reset by technician. Charger operational.'
  }
];

export const MONTHLY_SPEND_DATA = [
  { month: 'Apr', spend: 420, hours: 12, bookings: 5 },
  { month: 'May', spend: 680, hours: 18, bookings: 8 },
  { month: 'Jun', spend: 540, hours: 14, bookings: 6 },
  { month: 'Jul', spend: 890, hours: 24, bookings: 11 },
  { month: 'Aug', spend: 730, hours: 19, bookings: 9 },
];
