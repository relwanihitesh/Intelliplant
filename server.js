require('dotenv').config();
const app = require('./src/app');
const ConnectDB = require("./src/db/db");

ConnectDB();

const Port = 3000;

const server = app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
