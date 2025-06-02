// backend/server.js
const express = require('express');
const subdomain = require('express-subdomain');
const path = require('path');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const { errorHandler, logRequests } = require('./middleware');
const history = require('connect-history-api-fallback');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 1110;

app.use(cors({ origin: 'http://localhost:1111', credentials: true }));  // Configure cors middleware
app.use(express.json());
app.use(logRequests); // Log incoming requests

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});

// =======================================================================================
// Running py code
app.post('/api/run_python_script', async (req, res) => {
    // Perform any necessary cleanup or session handling on the server side
    console.log(`Running python script...`);
    try {
        const response = await axios.get('http://127.0.0.1:5000/run_python_script');

        if (response.status === 200) {
            console.log('Server MATLAB Result Directory:', response.data.NewJSONDir);

            // Send the expected structure to the frontend
            res.json({ result: response.data.NewJSONDir });
        } else {
            console.error('Error:', response.data.error);
            res.status(response.status).json({ error: response.data.error });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =======================================================================================
// Update dropdown list in simulation data ===============================================
const folderPath = path.join(__dirname, 'public/Outputs'); // Update the path accordingly
app.get('/api/getJsonFiles', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      res.json({ files: jsonFiles });
    });
  });
// END  ==================================================================================
// =======================================================================================