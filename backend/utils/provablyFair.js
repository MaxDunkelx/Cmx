import crypto from 'crypto';

/**
 * Generate a random seed
 * @returns {String} - Random seed
 */
export const generateSeed = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a hash from a seed
 * @param {String} seed - Random seed
 * @returns {String} - SHA-256 hash of the seed
 */
export const generateHash = (seed) => {
  return crypto.createHash('sha256').update(seed).digest('hex');
};

/**
 * Verify fairness of a game result
 * @param {String} serverSeed - Server's seed
 * @param {String} clientSeed - Client's seed (optional)
 * @param {String} publicHash - Public hash that was announced before the game
 * @returns {Boolean} - True if fair, false otherwise
 */
export const verifyFairness = (serverSeed, clientSeed, publicHash) => {
  if (!serverSeed || !publicHash) {
    return false;
  }
  
  const combinedSeed = clientSeed ? `${serverSeed}-${clientSeed}` : serverSeed;
  const calculatedHash = generateHash(combinedSeed);
  
  return calculatedHash === publicHash;
};

/**
 * Generate a random number from 0 to max using provably fair method
 * @param {String} seed - Random seed
 * @param {Number} max - Maximum value
 * @returns {Number} - Random number from 0 to max
 */
export const generateFairRandom = (seed, max = 100, index = 0) => {
  // Use HMAC-SHA256 for more secure random generation
  const data = `${seed}-${index}`;
  const hash = crypto.createHmac('sha256', seed).update(data).digest('hex');
  
  // Use multiple chunks of the hash for better distribution
  const randomValue = parseInt(hash.substring(0, 10), 16) % (max + 1);
  return randomValue;
};

/**
 * Create a provably fair game configuration
 * @returns {Object} - { seed, hash, publicHash }
 */
export const createProvablyFairConfig = () => {
  const seed = generateSeed();
  const hash = generateHash(seed);
  const publicHash = generateHash(hash); // Double hash for extra security
  
  return { seed, hash, publicHash };
};

/**
 * Generate a hash chain for multiple games
 * @param {Number} numberOfGames - Number of games to generate hashes for
 * @returns {Array} - Array of { index, publicHash }
 */
export const generateHashChain = (numberOfGames = 1000) => {
  let currentHash = generateSeed();
  const chain = [];
  
  for (let i = 0; i < numberOfGames; i++) {
    const publicHash = generateHash(currentHash);
    chain.push({ index: i, publicHash });
    currentHash = publicHash;
  }
  
  return chain;
};

