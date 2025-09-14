// CORS configuration for frontend
export const corsConfig = {
  origin: ['https://move-on-inky.vercel.app'],
  credentials: true
};

// Default axios configuration with CORS settings
export const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://move-on-inky.vercel.app',
    'Access-Control-Allow-Credentials': 'true',
  }
};
