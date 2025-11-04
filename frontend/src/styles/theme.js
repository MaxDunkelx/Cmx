// iOS Dark Mode Theme System
export const theme = {
  // User Theme - Dark Mode iOS Style
  user: {
    colors: {
      primary: '#5AC8FA',        // iOS Blue (lighter blue)
      secondary: '#AF52DE',      // iOS Purple (softer purple)
      accent: '#FFD60A',         // iOS Yellow Gold
      success: '#34C759',        // iOS Green
      warning: '#FF9500',        // iOS Orange
      error: '#FF3B30',          // iOS Red
      dark: '#000000',           // Pure Black
      darker: '#050505',
      light: '#1C1C1E',          // iOS Dark Gray
      lighter: '#2C2C2E'         // iOS Lighter Gray
    },
    gradients: {
      primary: 'linear-gradient(135deg, #5AC8FA 0%, #AF52DE 100%)',
      success: 'linear-gradient(135deg, #34C759 0%, #5AC8FA 100%)',
      accent: 'linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)',
      background: 'linear-gradient(135deg, #000000 0%, #1C1C1E 50%, #000000 100%)',
      card: 'linear-gradient(135deg, rgba(90,200,250,0.08) 0%, rgba(175,82,222,0.08) 100%)'
    },
    shadows: {
      primary: '0 4px 16px rgba(90, 200, 250, 0.2)',
      secondary: '0 4px 16px rgba(175, 82, 222, 0.2)',
      accent: '0 4px 16px rgba(255, 214, 10, 0.2)',
      glow: '0 0 32px rgba(90, 200, 250, 0.15)'
    }
  },
  
  // Admin Theme - iOS Dark Mode Professional
  admin: {
    colors: {
      primary: '#0A84FF',        // iOS System Blue
      secondary: '#5E5CE6',      // iOS Indigo
      accent: '#FF9F0A',         // iOS Orange
      success: '#30D158',        // iOS Green
      warning: '#FFD60A',        // iOS Yellow
      error: '#FF453A',          // iOS Red
      dark: '#000000',           // Pure Black
      darker: '#0A0A0A',
      light: '#1C1C1E',          // iOS Dark Gray
      lighter: '#2C2C2E'         // iOS Lighter Gray
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
      success: 'linear-gradient(135deg, #30D158 0%, #0A84FF 100%)',
      accent: 'linear-gradient(135deg, #FF9F0A 0%, #FFD60A 100%)',
      background: 'linear-gradient(135deg, #000000 0%, #1C1C1E 50%, #000000 100%)',
      card: 'linear-gradient(135deg, rgba(10,132,255,0.08) 0%, rgba(94,92,230,0.08) 100%)'
    },
    shadows: {
      primary: '0 4px 16px rgba(10, 132, 255, 0.2)',
      secondary: '0 4px 16px rgba(94, 92, 230, 0.2)',
      accent: '0 4px 16px rgba(255, 159, 10, 0.2)'
    }
  }
};

export default theme;
