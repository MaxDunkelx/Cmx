const { initFirebaseAdmin, getFirebaseAdmin } = require('./firebaseAdmin');

let firestore;

function getFirestore() {
  if (!firestore) {
    const admin = getFirebaseAdmin() || initFirebaseAdmin();
    firestore = admin.firestore();
  }
  return firestore;
}

function mapUserDoc(doc) {
  if (!doc || !doc.exists) return null;
  const data = doc.data() || {};
  return {
    _id: doc.id,
    ...data
  };
}

async function getUserByUid(uid) {
  if (!uid) return null;
  const doc = await getFirestore().collection('users').doc(uid).get();
  return mapUserDoc(doc);
}

async function getUserByEmail(email) {
  if (!email) return null;
  const snapshot = await getFirestore()
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return mapUserDoc(snapshot.docs[0]);
}

function buildUserDefaults({ uid, email, username, isAdmin }, fallback = {}) {
  const now = new Date().toISOString();
  const displayName =
    username ||
    fallback.username ||
    (email ? email.split('@')[0] : 'Player');

  return {
    firebaseUid: uid,
    legacyId: fallback._id || null,
    email: email || fallback.email || null,
    username: displayName,
    tier: fallback.tier ?? 1,
    isAdmin: fallback.isAdmin ?? Boolean(isAdmin),
    isBanned: fallback.isBanned ?? false,
    balance: fallback.balance ?? 10000,
    totalEarned: fallback.totalEarned ?? 0,
    totalWithdrawn: fallback.totalWithdrawn ?? 0,
    gamesPlayed: fallback.gamesPlayed ?? 0,
    gamesWon: fallback.gamesWon ?? 0,
    tasksCompleted: fallback.tasksCompleted ?? 0,
    notes: fallback.notes ?? null,
    createdAt: fallback.createdAt || now,
    updatedAt: now,
    lastLogin: now
  };
}

async function ensureUserProfile(firebaseUser, fallbackUser = null) {
  if (!firebaseUser || !firebaseUser.uid) {
    throw new Error('Firebase user information is required to ensure profile.');
  }

  const db = getFirestore();
  const docRef = db.collection('users').doc(firebaseUser.uid);
  const doc = await docRef.get();

  if (doc.exists) {
    return mapUserDoc(doc);
  }

  const defaults = buildUserDefaults(
    {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName,
      isAdmin: firebaseUser.isAdmin || firebaseUser.admin === true
    },
    fallbackUser
  );

  await docRef.set({
    _id: firebaseUser.uid,
    ...defaults
  });

  return {
    _id: firebaseUser.uid,
    ...defaults
  };
}

async function updateUserProfile(uid, updates = {}) {
  if (!uid) {
    throw new Error('User UID is required to update profile.');
  }

  if (!updates || Object.keys(updates).length === 0) {
    return getUserByUid(uid);
  }

  const db = getFirestore();
  const docRef = db.collection('users').doc(uid);

  const payload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await docRef.set(payload, { merge: true });

  const updated = await docRef.get();
  return mapUserDoc(updated);
}

async function touchLastLogin(uid) {
  if (!uid) return;
  await updateUserProfile(uid, { lastLogin: new Date().toISOString() });
}

async function getUserTransactions(uid) {
  if (!uid) return [];
  const snapshot = await getFirestore()
    .collection('users')
    .doc(uid)
    .collection('transactions')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .get();

  return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
}

async function addTransaction(uid, data) {
  if (!uid || !data) return null;
  const db = getFirestore();
  const collectionRef = db.collection('users').doc(uid).collection('transactions');
  const docRef = collectionRef.doc(data._id || undefined);
  const payload = {
    ...data,
    timestamp: data.timestamp || new Date().toISOString()
  };
  await docRef.set(payload);
  return { _id: docRef.id, ...payload };
}

async function getUserWithdrawals(uid) {
  if (!uid) return [];
  const snapshot = await getFirestore()
    .collection('users')
    .doc(uid)
    .collection('withdrawals')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .get();

  return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
}

async function addWithdrawal(uid, data) {
  if (!uid || !data) return null;
  const db = getFirestore();
  const collectionRef = db.collection('users').doc(uid).collection('withdrawals');
  const docRef = collectionRef.doc(data._id || undefined);
  const payload = {
    ...data,
    timestamp: data.timestamp || new Date().toISOString()
  };
  await docRef.set(payload);
  return { _id: docRef.id, ...payload };
}

async function updateWithdrawal(uid, withdrawalId, updates) {
  if (!uid || !withdrawalId) return null;
  const docRef = getFirestore()
    .collection('users')
    .doc(uid)
    .collection('withdrawals')
    .doc(withdrawalId);
  await docRef.set(updates, { merge: true });
  const updated = await docRef.get();
  return { _id: withdrawalId, ...updated.data() };
}

async function addGameSession(uid, data) {
  if (!uid || !data) return null;
  const db = getFirestore();
  const collectionRef = db.collection('users').doc(uid).collection('gamesessions');
  const docRef = collectionRef.doc(data._id || undefined);
  const payload = {
    ...data,
    timestamp: data.timestamp || new Date().toISOString(),
    sortKey: data.sortKey || Date.parse(data.timestamp) || Date.now()
  };
  await docRef.set(payload);
  return { _id: docRef.id, ...payload };
}

async function getUserGameSessions(uid) {
  if (!uid) return [];
  const snapshot = await getFirestore()
    .collection('users')
    .doc(uid)
    .collection('gamesessions')
    .orderBy('sortKey', 'desc')
    .limit(100)
    .get();

  return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
}

module.exports = {
  getFirestore,
  getUserByUid,
  getUserByEmail,
  ensureUserProfile,
  updateUserProfile,
  touchLastLogin,
  getUserTransactions,
  addTransaction,
  getUserWithdrawals,
  addWithdrawal,
  updateWithdrawal,
  addGameSession,
  getUserGameSessions
};

