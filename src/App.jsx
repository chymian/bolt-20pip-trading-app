import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Line } from 'react-chartjs-2';
    import {
      Chart as ChartJS,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
    } from 'chart.js';

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    export default function App() {
      const [historicalData, setHistoricalData] = useState([]);
      const [botStatus, setBotStatus] = useState('Stopped');

      useEffect(() => {
        fetchHistoricalData();
      }, []);

      const fetchHistoricalData = async () => {
        try {
          const response = await axios.get('/api/historical-data', {
            params: {
              instrument: 'EUR_USD',
              granularity: 'M1',
              count: 100,
            },
          });
          setHistoricalData(response.data);
        } catch (error) {
          console.error('Error fetching historical data:', error);
        }
      };

      const handleStartBot = async () => {
        try {
          await axios.post('/api/place-trade', {
            instrument: 'EUR_USD',
            units: 1000,
          });
          setBotStatus('Running');
        } catch (error) {
          console.error('Error starting bot:', error);
        }
      };

      const handleStopBot = () => {
        setBotStatus('Stopped');
      };

      const chartData = {
        labels: historicalData.length > 0 ? historicalData.map((candle) => candle.time) : [],
        datasets: [
          {
            label: 'Price',
            data: historicalData.length > 0 ? historicalData.map((candle) => candle.mid.c) : [],
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
        ],
      };

      return (
        <div className="container">
          <h1>Trading App</h1>
          <div className="dashboard">
            <div className="chart">
              {historicalData.length > 0 ? (
                <Line data={chartData} />
              ) : (
                <p>Loading historical data...</p>
              )}
            </div>
            <div className="controls">
              <h2>Bot Status: {botStatus}</h2>
              <button onClick={handleStartBot} disabled={botStatus === 'Running'}>
                Start Bot
              </button>
              <button onClick={handleStopBot} disabled={botStatus === 'Stopped'}>
                Stop Bot
              </button>
            </div>
          </div>
        </div>
      );
    }
