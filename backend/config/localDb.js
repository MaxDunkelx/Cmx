// Simple local JSON-based database for development
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize empty database
if (!fs.existsSync(DB_PATH)) {
  const initialData = {
    users: [],
    wallets: [],
    tasks: [],
    taskCompletions: [],
    gameSessions: [],
    withdrawals: []
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

export const db = {
  load() {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {
        users: [],
        wallets: [],
        tasks: [],
        taskCompletions: [],
        gameSessions: [],
        withdrawals: []
      };
    }
  },

  save(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }
};

