require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const gameRoutes = require('./routes/gameRoutes');
const pvpRoutes = require('./routes/pvpRoutes');
const socialRoutes = require('./routes/socialRoutes');
const contentRoutes = require('./routes/contentRoutes');

app.use('/api/game', gameRoutes);
app.use('/api/pvp', pvpRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/content', contentRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'LOGOS Backend is running', timestamp: new Date() });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
