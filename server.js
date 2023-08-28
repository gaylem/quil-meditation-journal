const path = require('path');
const express = require('express');
const app = express();
const PORT = 666;

app.use(express.json());

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, './src/index.html'));
});

app.get('/api', (req, res) => {
    res.json({ posts: ['post1', 'post2', 'post3'] });
});

// This does not seem to work
app.listen(666, () => {
    console.log('Server started on port 666');
});
