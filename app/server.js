
const http = require('http');
const PORT = 8080;

// Read the environment variable to display the deployment environment
const ENVIRONMENT = process.env.ENVIRONMENT || 'Unknown';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from the Student Dashboard! This instance is running in the **${ENVIRONMENT}** environment (Built from commit: ${process.env.COMMIT_SHA}).\n`);
});

server.listen(PORT, () => {
    console.log(`Student Dashboard running on port ${PORT}`);
});
