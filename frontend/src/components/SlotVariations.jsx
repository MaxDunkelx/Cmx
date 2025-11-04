// Slot Variations - 6 Different Slot Types

export const SLOT_TYPES = {
  CLASSIC_3: {
    id: 'classic3',
    name: 'Classic 3-Reel',
    rows: 1,
    reels: 3,
    symbols: ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣'],
    payouts: {
      '💎💎💎': { multiplier: 100, description: 'Diamonds' },
      '⭐⭐⭐': { multiplier: 50, description: 'Stars' },
      '7️⃣7️⃣7️⃣': { multiplier: 25, description: 'Sevens' },
      '🍒🍒🍒': { multiplier: 10, description: 'Cherries' },
      '🍋🍋🍋': { multiplier: 8, description: 'Lemons' },
      '🍊🍊🍊': { multiplier: 5, description: 'Oranges' }
    }
  },
  
  VEGAS_5: {
    id: 'vegas5',
    name: 'Vegas 5-Reel',
    rows: 1,
    reels: 5,
    symbols: ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣', '🃏', '🎰'],
    payouts: {
      '🎰🎰🎰🎰🎰': { multiplier: 500, description: 'Jackpot' },
      '💎💎💎💎💎': { multiplier: 200, description: 'All Diamonds' },
      '🃏🃏🃏🃏🃏': { multiplier: 150, description: 'All Jokers' },
      '⭐⭐⭐⭐⭐': { multiplier: 100, description: 'All Stars' }
    }
  },
  
  PROGRESSIVE: {
    id: 'progressive',
    name: 'Progressive 3x3',
    rows: 3,
    reels: 3,
    symbols: ['🍒', '🍋', '🍊', '⭐', '💎'],
    payouts: {
      diagonal: { multiplier: 50, description: 'Diagonal' },
      horizontal: { multiplier: 20, description: 'Horizontal' },
      vertical: { multiplier: 20, description: 'Vertical' }
    }
  },
  
  FRUITS_BONUS: {
    id: 'fruits',
    name: 'Fruits Bonus',
    rows: 2,
    reels: 3,
    symbols: ['🍒', '🍋', '🍊', '🍉', '🥝', '🍓', '⭐', '💎'],
    payouts: {
      'ALL_ROW': { multiplier: 30, description: 'Full Row Match' },
      'TWO_FRUITS': { multiplier: 5, description: 'Two Fruits' }
    }
  },
  
  MYSTERY_WHEEL: {
    id: 'mystery',
    name: 'Mystery Wheel',
    rows: 1,
    reels: 4,
    symbols: ['❓', '💎', '⭐', '🎁', '💰', '🎰', '🎯', '🎲'],
    payouts: {
      'MULTI_MATCH': { multiplier: 40, description: 'Multiple Matches' },
      'BONUS_SYMBOL': { multiplier: 10, description: 'Bonus Symbols' }
    }
  },
  
  MEGA_WIN: {
    id: 'megawin',
    name: 'Mega Win 3x2',
    rows: 2,
    reels: 3,
    symbols: ['💎', '⭐', '💰', '💵', '🎰', '🃏'],
    payouts: {
      'ALL_ROWS': { multiplier: 200, description: 'All Rows Match' },
      'DIAGONAL_MEGA': { multiplier: 100, description: 'Diagonal Mega' }
    }
  }
};

export default SLOT_TYPES;

