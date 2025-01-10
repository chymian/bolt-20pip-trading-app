import express from 'express';
    import cors from 'cors';
    import path from 'path';
    import { fileURLToPath } from 'url';
    import OandaApi from 'oanda-v20';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const app = express();
    app.use(cors());
    app.use(express.json());

    // OANDA API setup
    const apiKey = 'YOUR_OANDA_API_KEY'; // Replace with your OANDA API key
    const accountID = 'YOUR_ACCOUNT_ID'; // Replace with your OANDA account ID
    const environment = 'practice'; // Use 'live' for trading account
    const oanda = new OandaApi({ apiKey, environment });

    // Serve static files
    app.use(express.static(path.join(__dirname, 'dist')));

    // Fetch historical data
    app.get('/api/historical-data', async (req, res) => {
      const { instrument, granularity, count } = req.query;
      try {
        const response = await oanda.instrument.candles(instrument, {
          granularity,
          count,
        });
        res.json(response.candles);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ error: 'Failed to fetch historical data' });
      }
    });

    // Place a trade
    app.post('/api/place-trade', async (req, res) => {
      const { instrument, units } = req.body;
      try {
        const response = await oanda.order.market(accountID, {
          instrument,
          units,
        });
        res.json(response);
      } catch (error) {
        console.error('Error placing trade:', error);
        res.status(500).json({ error: 'Failed to place trade' });
      }
    });

    // Serve frontend
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
