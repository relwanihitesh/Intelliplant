const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const departmentRoutes = require('./routes/departmentRoutes');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const searchRoutes = require('./routes/searchRoutes');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: "https://intelliplant-frontend.vercel.app",
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});
app.use(limiter);
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'IntelliPlant API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);

module.exports = app;