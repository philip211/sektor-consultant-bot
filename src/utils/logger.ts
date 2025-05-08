const getTimestamp = () => {
  return new Date().toISOString();
};

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[${getTimestamp()}] [INFO] ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[${getTimestamp()}] [ERROR] ${message}`, error);
  },
  debug: (message: string, data?: any) => {
    if (process.env.MODE !== 'production') {
      console.debug(`[${getTimestamp()}] [DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  }
};
