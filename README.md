# Zola

An e-commerce application with a **Backend** (Spring Boot) and **Frontend** (React Native / Expo).

---

## Requirements

| Tool | Version |
|---|---|
| Java | 21+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| Android Studio + SDK | API 33+ |
| PostgreSQL | 14+ |

---

## Backend

### 1. Create a `.env` file in the `backend/` directory

```env
DB_URL=jdbc:postgresql://localhost:5432/Zola
DB_USERNAME=postgres
DB_PASSWORD=your_password

JWT_ACCESS_SIGNER_KEY=your_access_key
JWT_REFRESH_SIGNER_KEY=your_refresh_key

EMAIL_API_KEY=your_brevo_api_key
EMAIL_SENDER_EMAIL=your@email.com
EMAIL_SENDER_NAME=Zola

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Create the PostgreSQL database

```sql
CREATE DATABASE "Zola";
```

### 3. Run the backend

**Option 1 — Terminal:**

```bash
cd backend
./mvnw spring-boot:run
```

**Option 2 — IntelliJ IDEA:**

1. Open the `backend/` folder in IntelliJ
2. Install the **EnvFile** plugin (or manually configure environment variables in the Run Configuration)
3. Click **Run** on the `ZolaApplication` class

Backend will be available at: `http://localhost:8080/api`

Swagger UI: `http://localhost:8080/api/swagger-ui.html`

---

## Frontend

> The frontend uses **Expo Dev Client** — it is **not** compatible with Expo Go due to native modules (Realm, expo-image-picker, etc.).

### 1. Install JS dependencies

```bash
cd frontend
npm install
```

### 2. First time — Build native code and install on emulator

Start the Android Emulator from Android Studio first, then:

```bash
npx expo run:android
```

This will compile all native code (Gradle) and install the APK on the emulator. This may take **5–10 minutes** the first time.

### 3. Subsequent runs

If no native code has changed (no libraries added or removed), simply run:

```bash
npx expo start --dev-client
```

Then open the **Zola** app on the emulator — it will automatically connect to the Metro bundler.

---

## Notes

- Make sure the **backend is running** before starting the app.
- When running on an Android emulator, use `10.0.2.2` instead of `localhost` for the backend host.
- When running on a physical device, use the **LAN IP** of your machine (run `ipconfig getifaddr en0` on macOS to get the IP).
- Update `BASE_URL` in `frontend/src/services/api.ts` to match your environment.