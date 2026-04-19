require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const connectDB   = require('./config/db');

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in .env'); process.exit(1);
}

// Connect Database
connectDB();

const app = express();

// ── Security Headers ──────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow local frontend in dev ───────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'null'],
  credentials: true
}));

// ── Body Parser — cap at 10kb to prevent oversized payloads ──────────────
app.use(express.json({ limit: '10kb' }));

// ── Rate Limiting on Auth routes ──────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 requests per window
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/', (req, res) => res.send('LeatherCraft API Running'));

// Define Routes
app.use('/api/auth',      authLimiter, require('./routes/authRoutes'));
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/projects',  require('./routes/projectRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));

// ── Global error handler — never leak stack traces to client ──────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

