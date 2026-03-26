# Zola - Comprehensive E-Commerce Platform 🛒

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

**Zola** is a modern, full-stack mobile e-commerce application built with a robust **Spring Boot** backend and a dynamic **React Native (Expo)** frontend. It delivers a seamless shopping experience for end-users and powerful management tools for administrators, complete with real-time chat, push notifications, and advanced analytics.

---

## 🌟 Key Features

### 👤 User Application
* **Authentication & Security:** Secure JWT-based login, role-based access control, and OTP verification via email.
* **Product Discovery:** Browse products with complex variant options (colors, sizes), category filtering, and advanced search functionality.
* **Interactive Shopping Cart:** Real-time cart updates and seamless checkout process.
* **Smart Voucher System:** Post-purchase rewards and automatic discount voucher application algorithms.
* **Order Tracking:** Comprehensive order history, delivery status tracking, and API-driven cancellation handling.
* **Real-Time Customer Support:** Embedded live chat system with image sharing and real-time read receipts using WebSockets.
* **Push Notifications:** Instant background alerts for order updates, promotions, and new messages.
* **User Profile:** Manage personal details, shipping addresses, and product reviews.

### 🛡️ Admin Dashboard
* **Advanced Analytics:** Real-time daily order analytics, dynamic revenue charts, and flexible date-range filters.
* **Inventory Management:** Instant visibility into low-stock products and complete catalog control to prevent stockouts.
* **Order Fulfillment:** Direct action buttons for role-based status transitions and streamlined order processing.
* **Customer Support Hub:** Centralized real-time chat interface to handle user inquiries, providing stellar customer service.

---

## 🛠️ Technology Stack

### Backend
* **Core:** Java 21, Spring Boot 3.4.2
* **Database & Caching:** PostgreSQL (relational data), Redis (high-performance state & WebSocket session caching)
* **Security:** Spring Security (OAuth2), Custom JWT implementation (Nimbus JOSE)
* **API Documentation:** Springdoc OpenAPI (Swagger)
* **Cloud & 3rd Party Integrations:**
  * **Cloudinary:** Efficient image upload, transformation, and optimization
  * **Brevo:** Transactional email and secure OTP delivery
* **Architecture:** Layered RESTful API, MapStruct for seamless DTO conversions

### Frontend
* **Core:** React Native, Expo (Dev Client)
* **Language:** TypeScript for enterprise-grade type safety
* **Styling:** Tailwind CSS (via NativeWind) for highly responsive, consistent, and beautiful UI
* **Navigation:** React Navigation with file-based routing
* **State Management:** React Context API, custom hooks for optimistic UI updates
* **Network:** Axios with automated background JWT token refresh interceptors
* **Real-Time:** WebSockets for instant chat and notification sync

---

## 🚀 Getting Started

### Prerequisites
* Java 21+ & Maven 3.8+
* Node.js 18+
* Android Studio + SDK (API 33+) or iOS Simulator
* PostgreSQL 14+ & Redis

### 1. Backend Setup

1. Create a `.env` file in the `backend/` directory by copying the example file:
```bash
cp .env.example .env
```
*(Update the variables in `.env` with your actual database and API credentials)*

2. Initialize the Database:
```sql
CREATE DATABASE "Zola";
```

3. Run the Spring Boot Server:
```bash
cd backend
./mvnw spring-boot:run
```
*API is available at `http://localhost:8080/api`*
*Swagger UI is at `http://localhost:8080/api/swagger-ui.html`*

### 2. Frontend Setup

> **Note:** The frontend relies on **Expo Dev Client** due to extensive native modules. It is not compatible with standard Expo Go.

1. Install Dependencies:
```bash
cd frontend
npm install
```

2. Compile Native Code (First Run):
Ensure an Android Emulator/iOS Simulator is running, then execute:
```bash
npx expo run:android
# or
npx expo run:ios
```

3. Subsequent Runs:
```bash
npx expo start --dev-client
```

*Update `BASE_URL` in `frontend/src/services/api.ts` to match your local IP (e.g., `http://192.168.1.X:8080`) when testing on physical mobile devices.*

---

## 💡 Architecture Highlights
* **Modular Backend:** Business logic cleanly separated across domain modules (`cart`, `order`, `chat`, `notification`, etc.) making the codebase highly scalable and maintainable.
* **Real-time Engine:** Custom-built socket architecture handles multi-session message delivery, reliable notification broadcasting, and dynamic unread badges synchronization without performance degradation.
* **Clean UI/UX:** Engineered for performance with stacked image rendering, inverted chat lists for buttery smooth 60fps scrolling, and modularized React components ensuring an app store-ready user experience.

---

> Designed & Developed by **[Your Name/Profile Link]**