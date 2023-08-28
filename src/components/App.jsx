import React, { useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';

function App() {
    const [nasaData, setNasaData] = useState({});
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        // Testing fetching external API -- this works
        fetch(
            'https://api.nasa.gov/planetary/apod?api_key=4LI6zdP9bsTQ8EtctAniacB3nVF7t2fceEa3SIgF'
        )
            .then((response) => response.json())
            .then((data) => {
                setNasaData(data);
            });

        // Backend API on server.js -- this does not work
        fetch('/api')
            .then((response) => response.json())
            .then((data) => {
                setPostData(data);
            });
    }, []);

    return (
        <div>
            <p>is anyone home?</p>
            <p>{nasaData.explanation}</p>
            <p>{postData.posts}</p>
        </div>
    );
}

const root = createRoot(document.querySelector('#root'));
root.render(<App />);

export default App;
