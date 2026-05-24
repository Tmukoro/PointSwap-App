# PointSwap - NYSC Clothes Swapping App (Frontend)

A React Native mobile application built with Expo that connects Nigerian NYSC corps members for easy clothes swapping within their camps. Share what you don't need, find what you do - all based on your location.

[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-000020?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 🎯 Features

### Core Functionality
- **📍 Location-Based Feed** - Automatically detects your NYSC camp and shows products from corps members in your area
- **👕 Product Listings** - Upload items you want to swap with photos, category, and size
- **💬 Real-Time Messaging** - Chat with other users via Ably-powered instant messaging
- **🎤 Voice Messages** - Send voice notes in conversations for easier communication
- **🔔 Smart Notifications** - Get notified when products match your wants or when you receive messages
- **🤝 Swap Verification System** - Secure swap finalization with unique codes to prevent fraud
- **🔐 Firebase Authentication** - Sign in with Google, Facebook, or Apple (OAuth)

### User Experience
- **Profile Management** - Customize your profile with avatar, location, and personal details
- **Product Matching** - Mutual matching system finds perfect swap partners automatically
- **Image & Audio Upload** - Powered by Cloudinary for fast, reliable media storage
- **Online Status Tracking** - See when other users are active in real-time
- **Optimistic UI** - Messages appear instantly with pending states for smooth UX

---

## 🛠️ Tech Stack

### Framework & Language
- **React Native** (via Expo SDK 52)
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation

### UI & Design
- **Tamagui** - Design system and UI components
- **React Native Gifted Chat** - Pre-built chat UI
- **Lucide Icons** - Modern icon library
- **React Native Tab View** - Tab navigation components

### Real-Time & Communication
- **Ably** - Real-time messaging, typing indicators, presence
- **Expo Notifications** - Push notifications for messages and matches
- **Expo AV** - Voice message recording and playback

### Storage & Media
- **Expo Secure Store** - Encrypted local storage for tokens
- **Async Storage** - Non-sensitive local data
- **Cloudinary** - Cloud storage for images and audio files

### Location & Maps
- **Expo Location** - GPS coordinates for camp detection

### Authentication
- **Firebase** - OAuth providers (Google, Facebook, Apple)
- **expo-auth-session** - OAuth flow handling
- **expo-crypto** - Cryptographic utilities

### Networking
- **Axios** - HTTP client for REST API communication

### Other
- **React Native Toast Message** - In-app toast notifications
- **React Native Keyboard Controller** - Enhanced keyboard handling

---

## 📱 Screenshots

<!-- Add screenshots here when available -->
_Screenshots coming soon_

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo Go app (for testing) or EAS CLI (for development builds)
- Active internet connection

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pointswap-app.git
   cd pointswap-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `config/firebase.ts` file:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export default app;
   ```

4. **Update API Base URL**
   
   In all service files (`services/*.ts`), update:
   ```typescript
   const API_BASE_URL = 'YOUR_BACKEND_URL';
   ```

5. **Run the app**
   ```bash
   npx expo start
   ```

---

## 🏗️ Project Structure

```
pointswap-app/
├── app/                      # Expo Router screens
│   ├── (home)/              # Onboarding & authentication
│   ├── (tabs)/              # Main app tabs (home, chat, notifications, settings)
│   ├── (screens)/           # Modal screens (product view, chat details, etc.)
│   └── _layout.tsx          # Root layout with auth checking
├── components/              # Reusable UI components
│   ├── chat/                # Chat-specific components (bubbles, audio, etc.)
│   ├── notifications/       # Notification item components
│   └── modals/              # Modal components (swap request, swap code)
├── services/                # API & external service integrations
│   ├── messageService.ts    # Chat & messaging API
│   ├── ablyService.ts       # Real-time Ably client
│   ├── NotificationService.ts
│   ├── LocationService.ts
│   ├── SwapService.ts
│   ├── uploadService.ts     # Cloudinary uploads
│   └── FirebaseAuthService.ts
├── config/                  # Configuration files
│   └── firebase.ts          # Firebase initialization
├── types/                   # TypeScript type definitions
└── assets/                  # Images, fonts, icons
```

---

## 🔑 Key Features Explained

### 1. Location-Based Filtering
When users register, the app:
- Requests GPS coordinates
- Sends coordinates to backend
- Backend uses Haversine formula to find nearest NYSC camp
- Product feed automatically filters to show only items from users in the same camp

### 2. Real-Time Messaging
- **Ably token caching** - First request: ~700ms, subsequent: ~5ms (140x faster!)
- **Optimistic UI** - Messages appear instantly, sent via REST API fallback if Ably isn't connected
- **Voice notes** - Record, upload to Cloudinary, play with waveform visualization
- **Typing indicators** - See when the other person is typing

### 3. Product Matching Notifications
- Users set "wants" for each product they upload
- Backend finds mutual matches (A wants what B has, B wants what A has)
- Both users get push notifications when a match is found
- Notifications grouped by time (Today, This week, Older)

### 4. Swap Verification System
- User A initiates swap request in chat
- User B receives modal: "User A wants to finalize swap with you"
- User B accepts → Both receive unique 6-digit code
- Warning: "Don't share code until in-person meetup"
- In person: Both show codes, verify they match, complete swap

### 5. Firebase OAuth
- Supports Google, Facebook, Apple sign-in
- Flow: OAuth → Firebase token → Backend verification → JWT token
- `profile_complete` flag determines redirect (profile setup vs home)

---

## 🎨 Design Patterns

### Services Architecture
Each external integration has its own service class:
- **Singleton pattern** - `export default new ServiceName()`
- **Token management** - Auto-sets auth headers from SecureStore
- **Error handling** - Centralized try-catch with user-friendly messages

### State Management
- **React hooks** - useState, useEffect, useCallback for local state
- **Secure storage** - Sensitive data (tokens, user ID) in expo-secure-store
- **Optimistic updates** - UI updates immediately, syncs with server in background

### Real-Time Architecture
- **Ably channels** - Separate channels for messages, typing, presence, swap events
- **Background connection** - Load messages first, connect to Ably in parallel
- **REST fallback** - Messages always send via HTTP, Ably for real-time delivery

---

## 📦 Building for Production

### Development Build (required for Firebase OAuth, push notifications)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for Android**
   ```bash
   eas build --profile development --platform android
   ```

4. **Build for iOS**
   ```bash
   eas build --profile development --platform ios
   ```

### Production Build

```bash
eas build --profile production --platform all
```

---

## 🔐 Environment Variables

Required configuration in service files:

```typescript
// Firebase Config (config/firebase.ts)
apiKey: "..."
authDomain: "..."
projectId: "..."
storageBucket: "..."
messagingSenderId: "..."
appId: "..."

// API Base URL (services/*.ts)
API_BASE_URL: "http://your-backend-url:8080/pointSwapApi/v1"
```

---

## 🐛 Known Issues & Limitations

### Expo Go Limitations
The following features require a development build and **do not work in Expo Go**:
- Firebase OAuth (Google, Facebook, Apple sign-in)
- Push notifications (production)
- Voice calls (Agora - not yet implemented)

### Current Limitations
- Voice calls deferred until production build
- Only text available camps added (need full NYSC camps database)
- Online status polling every 30 seconds (consider Ably Presence for real-time)

---

## 🚧 Roadmap

- [ ] Voice/video calls via Agora
- [ ] Complete NYSC camps database
- [ ] Swap history & ratings system
- [ ] In-app reporting for inappropriate content
- [ ] Product search & advanced filtering
- [ ] Favorite products/wishlists
- [ ] User blocking functionality
- [ ] App analytics & crash reporting

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Mukoro Oghenetega Daniel**
- LinkedIn: [linkedin.com/in/yourprofile](linkedin.com/in/oghenetega-mukoro)
- Email: tmukoro62@gmail.com

---



**Built with ❤️ for Nigerian corps members**

---

_Note: This is the frontend repository. For the backend (Go + PostgreSQL), see [pointswap-backend](https://github.com/yourusername/pointswap-backend)_
