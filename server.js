import express from 'express';
    import cors from 'cors';
    import path from 'path';
    import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const app = express();
    app.use(cors()); // Enable CORS
    app.use(express.json());

    // Serve static files from the frontend build
    app.use(express.static(path.join(__dirname, 'dist')));

    // Mock market data for testing
    const mockMarketData = [
      { timestamp: '2023-10-01T10:00:00Z', price: 150.25 },
      { timestamp: '2023-10-01T11:00:00Z', price: 151.30 },
      { timestamp: '2023-10-01T12:00:00Z', price: 152.10 },
      { timestamp: '2023-10-01T13:00:00Z', price: 151.75 },
      { timestamp: '2023-10-01T14:00:00Z', price: 152.50 },
    ];

    app.get('/api/market-data', (req, res) => {
      res.json(mockMarketData); // Return mock data
    });

    // Serve the frontend index.html for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
