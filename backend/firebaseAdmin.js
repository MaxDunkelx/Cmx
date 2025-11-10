const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

let initialized = false;

function resolveServiceAccountPath() {
  const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const defaultPath = path.resolve(__dirname, '../firebase/backend-service-account.json');
  return explicitPath ? path.resolve(explicitPath) : defaultPath;
}

function loadServiceAccount() {
  const resolvedPath = resolveServiceAccountPath();

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `Firebase service account file not found at ${resolvedPath}. ` +
      `Set FIREBASE_SERVICE_ACCOUNT_PATH or create the file at the default location.`
    );
  }

  const contents = fs.readFileSync(resolvedPath, 'utf8');
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(`Invalid JSON in Firebase service account file: ${error.message}`);
  }
}

function initFirebaseAdmin() {
  if (initialized) {
    return admin;
  }

  const serviceAccount = loadServiceAccount();

  if (!process.env.FIREBASE_PROJECT_ID) {
    process.env.FIREBASE_PROJECT_ID = serviceAccount.project_id;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  initialized = true;
  return admin;
}

function getFirebaseAdmin() {
  if (!initialized && admin.apps.length === 0) {
    initFirebaseAdmin();
  }
  return admin;
}

module.exports = {
  initFirebaseAdmin,
  getFirebaseAdmin
};

