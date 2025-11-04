const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Helper to read JSON file
function readJSONFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Helper to write JSON file
function writeJSONFile(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Generate new ID
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Database operations
const DB = {
  users: {
    findAll: () => readJSONFile('users.json'),
    findById: (id) => readJSONFile('users.json').find(u => u._id === id),
    findByEmail: (email) => readJSONFile('users.json').find(u => u.email === email),
    create: (userData) => {
      const users = readJSONFile('users.json');
      const newUser = { ...userData, _id: generateId(), createdAt: new Date().toISOString() };
      users.push(newUser);
      writeJSONFile('users.json', users);
      return newUser;
    },
    update: (id, updates) => {
      const users = readJSONFile('users.json');
      const index = users.findIndex(u => u._id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        writeJSONFile('users.json', users);
        return users[index];
      }
      return null;
    }
  },
  
  transactions: {
    findAll: () => readJSONFile('transactions.json'),
    findByUserId: (userId) => readJSONFile('transactions.json').filter(t => t.userId === userId),
    create: (transactionData) => {
      const transactions = readJSONFile('transactions.json');
      const newTx = { ...transactionData, _id: generateId() };
      transactions.push(newTx);
      writeJSONFile('transactions.json', transactions);
      return newTx;
    }
  },
  
  gameSessions: {
    findAll: () => readJSONFile('gamesessions.json'),
    findByUserId: (userId) => readJSONFile('gamesessions.json').filter(g => g.userId === userId),
    create: (sessionData) => {
      const sessions = readJSONFile('gamesessions.json');
      const newSession = { ...sessionData, _id: generateId() };
      sessions.push(newSession);
      writeJSONFile('gamesessions.json', sessions);
      return newSession;
    }
  },
  
  tasks: {
    findAll: () => readJSONFile('tasks.json'),
    findById: (id) => readJSONFile('tasks.json').find(t => t._id === id)
  },
  
  withdrawals: {
    findAll: () => readJSONFile('withdrawals.json'),
    findByUserId: (userId) => readJSONFile('withdrawals.json').filter(w => w.userId === userId),
    create: (withdrawalData) => {
      const withdrawals = readJSONFile('withdrawals.json');
      const newWd = { ...withdrawalData, _id: generateId() };
      withdrawals.push(newWd);
      writeJSONFile('withdrawals.json', withdrawals);
      return newWd;
    },
    update: (id, updates) => {
      const withdrawals = readJSONFile('withdrawals.json');
      const index = withdrawals.findIndex(w => w._id === id);
      if (index !== -1) {
        withdrawals[index] = { ...withdrawals[index], ...updates };
        writeJSONFile('withdrawals.json', withdrawals);
        return withdrawals[index];
      }
      return null;
    }
  }
};

module.exports = DB;

