# Padmaisha CRM Admin Panel

## Setup Instructions

### 1. Firebase Setup
- Create a Firebase project at https://console.firebase.google.com/
- Enable Authentication (Email/Password and Google)
- Enable Firestore Database
- Add your Firebase config to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

- Set Firestore rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'padmaisha940@gmail.com';
    }
  }
}
```

### 2. Install Dependencies
```
npm install
```

### 3. Run Locally
```
npm run dev
```

### 4. Deploy
- **Vercel**: Push to GitHub, import in Vercel, set env vars
- **Firebase Hosting**: `firebase init hosting`, set up build output, deploy

## Features
- Admin-only authentication (email/password or Google)
- Real-time Firestore sync
- Responsive dashboard (light/dark mode)
- User CRUD, revenue, analytics, audit logs
- Secure route protection
- Error handling, notifications
- CSV export

## Edge Cases
- Handles no data, offline, invalid login, large datasets, errors

## Testing
- Unit tests: `__tests__/components/`
- Integration tests: `__tests__/integration/`

---
For any issues, check your Firebase config, rules, and environment variables.
