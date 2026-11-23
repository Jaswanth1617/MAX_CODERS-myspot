# 🅿️ myspot — AI-Powered Smart Parking & IoT Mobility System

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![YOLO](https://img.shields.io/badge/Ultralytics-YOLOv8-FF7F00?logo=yolo&logoColor=white)](https://ultralytics.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-Computer_Vision-5C3EE8?logo=opencv&logoColor=white)](https://opencv.org/)
[![IoT Hardware](https://img.shields.io/badge/Hardware-RPi5%20%7C%20ESP32-E30A5C)](https://www.raspberrypi.com/)

---

## 📌 Overview

**myspot** is a next-generation, AI-driven smart parking and automated mobility platform designed to eradicate urban parking congestion. Combining a responsive client application with Edge Computer Vision (YOLO + PaddleOCR) and IoT hardware (Raspberry Pi 5 + ESP32), **myspot** bridges parking seekers, private space hosts, and automated barrier hardware in real time.

Drivers locate, reserve, and navigate to verified parking bays with real-time ETA and walking routes, while property owners monetize unused parking slots with automated boom barrier control, AI-monitored occupancy, and detailed financial analytics.

---

## 🚀 Key Features

### 🚗 Slot Seeker (Driver Experience)
* **Live GPS Discovery:** Pinpoints the user's live geolocation and calculates dynamic distance, driving ETA, and walking duration using the Haversine algorithm.
* **Interactive Map Routing:** Powered by Leaflet and OpenStreetMap with interactive location pins, directions, and filtering (CCTV protected, EV charging, covered roof).
* **Multi-Vehicle Garage:** Register and manage multiple four-wheelers and two-wheelers with verified vehicle insurance and license proofs.
* **Flexible Checkout & Holds:** Instant online digital reservations or cash-on-arrival "Hold" bookings with host approval workflows.
* **Encrypted Digital QR Passes:** Dynamic, high-resolution QR entry passes for contactless barrier scanning and gate unlocking.

### 🏢 Host & Property Owner Portal
* **Space Onboarding:** Verified property listing with land ownership deed checks, custom bay layouts, and hourly pricing.
* **AI Sentinel CCTV Subscription:** Integrated 24/7 surveillance tracking vehicle entry, bay compliance, and overstay violations.
* **Live Bay Occupancy Matrix:** Real-time visual status of individual bays (Occupied, Free, Reserved) synchronized with IoT sensors.
* **Financial Analytics:** Interactive revenue tracking via Recharts (gross earnings, online payouts, cash collections, and one-click withdrawals).
* **Seeker Dispute Logging:** Host incident reporting for vehicle overstays or lane obstructions.

### 🤖 Edge Computer Vision & ANPR
* **Vehicle Detection & Classification:** YOLO models run on edge feeds to detect cars, bikes, and open slots in milliseconds.
* **Automated Number Plate Recognition (ANPR / ALPR):** PaddleOCR extracts vehicle registration plates at entry gates and matches them against active reservations.
* **Smart Boom Barrier Automation:** Direct relay activation automatically lifts barriers for verified vehicle plates or scanned QR passes.

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │   Driver / Space Host  │
                                  │   React 19 Client SPA  │
                                  └───────────┬────────────┘
                                              │ HTTPS / WSS
                                              ▼
                                  ┌────────────────────────┐
                                  │   Flask REST / API     │
                                  │   (Python / SQLAlchemy)│
                                  └─────┬──────────────┬───┘
                                        │              │
                     ┌──────────────────┴───┐      ┌───┴────────────────┐
                     │ PostgreSQL Database  │      │ Edge Compute Node  │
                     │  - Users & Roles     │      │ (Raspberry Pi 5)   │
                     │  - Bays & Inventory  │      └───────────┬────────┘
                     │  - Bookings & Passes │                  │
                     └──────────────────────┘                  ▼
                                                  ┌─────────────────────────┐
                                                  │ IP CCTV Camera Feed     │
                                                  │ ├─ OpenCV Stream Preproc│
                                                  │ ├─ YOLO Vehicle Detect  │
                                                  │ └─ PaddleOCR Plate ANPR │
                                                  └────────────┬────────────┘
                                                               │ GPIO / UART
                                                               ▼
                                                  ┌─────────────────────────┐
                                                  │ ESP32 Microcontroller   │
                                                  │ ├─ IR & Ultrasonic Sens │
                                                  │ └─ Relay Module         │
                                                  └────────────┬────────────┘
                                                               │ Pulse Signal
                                                               ▼
                                                  ┌─────────────────────────┐
                                                  │ Automatic Boom Barrier  │
                                                  └─────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend
* **Core:** React 19 (`react@^19.2.8`, `react-dom@^19.2.8`)
* **Build Tool:** Vite 8 (`vite@^8.2.0`, `@vitejs/plugin-react@^6.0.4`)
* **Styling:** Tailwind CSS 3.4 (`tailwindcss@^3.4.17`), PostCSS, Autoprefixer
* **State Management:** React Context API (`AppContext.jsx`) with local state persistence
* **Mapping:** Leaflet (`leaflet@^1.9.4`), React-Leaflet (`react-leaflet@^5.0.0`), OpenStreetMap Tile & Nominatim Reverse Geocoding API
* **Data Visualization:** Recharts (`recharts@^3.10.1`)
* **Icons & Animation:** Lucide React (`lucide-react@^1.32.0`), Canvas Confetti (`canvas-confetti@^1.9.4`)
* **Passes:** QRCode (`qrcode@^1.5.4`)

### Backend & AI / ML
* **Language & Framework:** Python 3.11+, Flask (RESTful APIs, WebSocket events)
* **Object-Relational Mapping (ORM):** SQLAlchemy
* **Computer Vision:** OpenCV (image acquisition, stream preprocessing, perspective transformation)
* **Object Detection:** Ultralytics YOLOv8 / YOLOv9 (vehicle detection and bay classification)
* **Optical Character Recognition:** PaddleOCR (high-accuracy Indian and international number plate parsing)

### Database
* **Primary Database:** PostgreSQL 16+ (relational schema for users, roles, bays, reservations, logs, and transactions)

---

## 🔌 Hardware & Embedded IoT

| Component | Role / Specification |
| :--- | :--- |
| **Raspberry Pi 5 (8GB)** | Edge computing hub running Python, OpenCV, YOLO inference, and local gate arbitration. |
| **ESP32 Microcontroller** | Low-latency sub-controller interfacing with bay-level sensors and physical gate triggers. |
| **IP CCTV Cameras** | RTSP high-definition video stream capture for entry/exit lanes and overhead bay surveillance. |
| **Ultrasonic Sensors (HC-SR04)** | Precise distance-based bay occupancy measurement (detects vehicle height/presence). |
| **IR Infrared Sensors** | Proximity detection for approach lanes to activate camera capture and trigger alerts. |
| **Relay Module (5V/12V)** | Optocoupler-isolated relay triggering 24V boom barrier gate solenoids/motors. |
| **Automatic Boom Barrier Gate**| High-speed commercial vehicular barrier with automatic open/close limit switches. |

---

## 📦 Core Dependencies

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "clsx": "^2.1.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^1.32.0",
    "qrcode": "^1.5.4",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-leaflet": "^5.0.0",
    "recharts": "^3.10.1",
    "tailwind-merge": "^3.6.0"
  }
}
```

### Backend & Edge AI (`requirements.txt`)
```text
flask>=3.0.0
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.9
opencv-python>=4.9.0
ultralytics>=8.1.0
paddleocr>=2.7.0
paddlepaddle>=2.6.0
pyjwt>=2.8.0
cryptography>=42.0.0
requests>=2.31.0
pyserial>=3.5
```

---

## 🔒 Security & Cryptography

* **JWT (JSON Web Tokens):** Secure, stateless authentication for both Slot Seekers and Parking Hosts with token expiry and role-based route guardrails.
* **AES-256 Encryption:** Military-grade symmetrical encryption protecting sensitive KYC documents, user Aadhaar numbers, and property ownership deeds at rest.
* **SHA-256 Hashing:** Tamper-proof cryptographic hashing for digital QR pass payloads, ensuring entry passes cannot be modified or forged offline.
* **Simulated Multi-Factor Verification:** 6-digit OTP verification sequences for mobile numbers and biometric Aadhaar validation.
* **Audit Trails & Security Logs:** Immutable host violation reports and entry/exit timestamps stored with snapshot references.

---

## 📂 Project Structure

```
myspot/
├── public/                 # Static assets and icons
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/             # Branding and hero illustrations
│   ├── components/
│   │   ├── auth/           # Login, Registration wizard, OTP modals
│   │   ├── booking/        # Digital Pass, Pass verification, Payment modals
│   │   ├── common/         # Header, Sidebar, Bottom navigation, Toast notifications
│   │   ├── home/           # Search, Filters, Slot cards, Slot details
│   │   ├── host/           # Host dashboard, Revenue analytics, Bay manager, Reports
│   │   ├── map/            # React-Leaflet parking map, custom pins, GPS tracking
│   │   ├── owner/          # Legacy host modal controls
│   │   ├── report/         # Seeker dispute filing
│   │   ├── slots/          # Active and past booking history
│   │   ├── support/        # Help center and customer support
│   │   └── vehicle/        # Multi-vehicle garage manager
│   ├── context/            # AppContext.jsx (global reactive state machine)
│   ├── data/               # mockData.js (preset seed records)
│   ├── utils/              # geoUtils.js (Haversine distance, ETA, reverse geocoding)
│   ├── App.jsx             # Root view orchestrator and role routing
│   ├── index.css           # Tailwind design tokens and utility classes
│   └── main.jsx            # React root mount
├── index.html              # HTML5 entry with fonts and Leaflet styles
├── package.json            # NPM dependencies and scripts
├── tailwind.config.js      # Custom theme color palettes and typography
├── vite.config.js          # Vite build config
└── README.md               # Project documentation
```

---

## ⚡ Getting Started

### 1. Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm** or **pnpm**
* **Python:** 3.11+ (for backend and edge AI services)
* **PostgreSQL:** 15+ (for database instance)

### 2. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Jaswanth1617/myspot.git
cd myspot

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
The client app will launch at `http://localhost:5173`.

### 3. Backend & AI Edge Service Setup (Optional / Production)
```bash
# Navigate to backend directory or virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install Python & AI dependencies
pip install -r requirements.txt

# Run the Flask API server
python app.py
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🚦 Verification & Testing
* **Linting:** Run `npm run lint` with **Oxlint** for fast diagnostics.
* **Pass Testing:** Open the app and append query parameters `?verifyPass=BKG-101` to test the integrated security guard/host gate pass verification dialog.

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 👥 Authors & Acknowledgments
* **Jaswanth** ([@Jaswanth1617](https://github.com/Jaswanth1617)) — Architecture, Frontend Engineering, AI & IoT Integration.
* Powered by [Ultralytics](https://ultralytics.com), [PaddlePaddle](https://www.paddlepaddle.org.cn/), and [OpenStreetMap](https://www.openstreetmap.org/).
