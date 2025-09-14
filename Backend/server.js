const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Export for Vercel
module.exports = app;