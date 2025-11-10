## Firebase Integration Workspace

This directory contains shared guidance and helper files for migrating the CMX platform from its local JSON database to Firebase services.

### What Lives Here
- `frontend.env.example` — template for the frontend `.env.local`.
- `backend-service-account.example.json` — shape of the Firebase Admin credential file expected by the backend.
- Documentation snippets, migration notes, and future scripts/tools for data handling.

### Getting Started
1. Create a Firebase project (already done) and enable the services you intend to use (Authentication, Firestore, Storage, etc.).
2. Generate a web app configuration in the Firebase console and copy the values into a new `frontend/.env.local` file using `frontend.env.example` as the template.

   ```bash
   # frontend/.env.local
   VITE_FIREBASE_API_KEY="AIzaSyCGn1moAglk-kRrFwoIz_X3s7j3JFrwD7w"
   VITE_FIREBASE_AUTH_DOMAIN="cmxx-83b5f.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="cmxx-83b5f"
   VITE_FIREBASE_STORAGE_BUCKET="cmxx-83b5f.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="699587315355"
   VITE_FIREBASE_APP_ID="1:699587315355:web:d9a34f197ff9aa9d8ae83e"
   VITE_FIREBASE_MEASUREMENT_ID="G-SQ1SYH04BD"
   ```

3. Generate a service account key (JSON) for server-side access and place it somewhere secure. The backend will read it from the path defined by the `FIREBASE_SERVICE_ACCOUNT_PATH` environment variable. When running locally you can export it in your shell or place it in `backend/.env`:

   ```bash
   # backend/.env (example)
   FIREBASE_SERVICE_ACCOUNT_PATH="../firebase/backend-service-account.json"
   FIREBASE_PROJECT_ID="cmxx-83b5f"
   ```

4. Keep this directory out of production builds if it grows to include scripts or sensitive data. It is meant for developer coordination while the migration is in progress.

> **Note:** Never commit actual secrets. Copy the examples, fill in your real values locally, and keep them ignored via `.gitignore`.

