import express from 'express';
import path from 'path';
import { InfluxDBClient } from '@influxdata/influxdb3-client';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// InfluxDB Configuration
const token = "Q0Plh5TbOioffW2qz3kw-jOD2QtfcNR24LBS4bGsGEdTLb1ZjKcy-KPHFXVzsV55N74zMDeYju5VobdFY5kJ1Q==";
const client = new InfluxDBClient({host: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token});

// Set up static folder to serve Bootstrap and Chart.js
app.use(express.static(path.join(__dirname, 'public')));

// Route for Dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Endpoint for Realtime Temperature Data
app.get('/api/temperature', async (req, res) => {
  try {
    const query = `SELECT temperature FROM 'temp_data' 
    WHERE time >= now() - interval '5 minutes' 
    ORDER BY time DESC 
    LIMIT 1`;
    
    const rows = await client.query(query, 'sensor_data');
    
    let temperature = null;
    for await (const row of rows) {
      temperature = row.temperature;
      break; // We only want the most recent reading
    }
    
    // If no temperature found, use a default simulated value
    if (temperature === null) {
      temperature = (Math.random() * 10 + 20).toFixed(1);
    }
    
    res.json({ temperature: Number(temperature).toFixed(1) });
  } catch (error) {
    console.error('Error fetching temperature:', error);
    res.status(500).json({ error: 'Could not fetch temperature' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Cleanup InfluxDB client when server is stopped
process.on('SIGINT', () => {
  client.close();
  process.exit();
});