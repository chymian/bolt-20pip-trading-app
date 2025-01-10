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
      const [marketData, setMarketData] = useState([]);
      const [botStatus, setBotStatus] = useState('Stopped');

      useEffect(() => {
        fetchMarketData();
      }, []);

      const fetchMarketData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/market-data');
          setMarketData(response.data);
        } catch (error) {
          console.error('Error fetching market data:', error);
        }
      };

      const handleStartBot = () => {
        setBotStatus('Running');
      };

      const handleStopBot = () => {
        setBotStatus('Stopped');
      };

      const chartData = {
        labels: marketData.length > 0 ? marketData.map((data) => data.timestamp) : [],
        datasets: [
          {
            label: 'Price',
            data: marketData.length > 0 ? marketData.map((data) => data.price) : [],
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
              {marketData.length > 0 ? (
                <Line data={chartData} />
              ) : (
                <p>Loading market data...</p>
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
