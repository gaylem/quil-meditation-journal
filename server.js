const path = require('path');
const express = require('express');
const app = express();
const PORT = 666;

app.use(express.json());

app.get('/', (req, res) => {
  console.log(req.body);
  return res.sendFile(path.join(__dirname, './src/index.html'));
});

// This seems to break the server
app.listen(666, () => {
  console.log('Server started on port 666');
});
