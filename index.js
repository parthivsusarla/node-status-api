const express = require('express');
const app = express();
const PORT = 3000;

// Define the /status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: "Application is running successfully"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 
