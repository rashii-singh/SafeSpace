import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SafeSpace API' });
});

export default app;
