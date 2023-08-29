const path = require('path');
const express = require('express');
const app = express();
const PORT = 666;

console.log('NODE_ENV: ', process.env.NODE_ENV)

app.use(express.json());

// ROUTES

app.get('/api', (req, res) => {
    res.json({ posts: ['post1', 'post2', 'post3'] });
});

// ENVIRONMENTS

if (process.env.NODE_ENV === 'production') {
    // statically serve everything in the build folder on the route '/build'
    app.use('/build', express.static(path.join(__dirname, '../build')))

    // serve the index.html on a request to the root
    app.get('/', (req, res) => {
        return res.status(200).sendFile(path.join(__dirname, '../index.html'));
    });
}

// This does not seem to work
app.listen(666, () => {
    console.log(`Server started on port ${PORT}`);
});
