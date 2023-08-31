import React from 'react';
import { useState, useEffect } from 'react';
import PastEntry from './PastEntry';

const PastEntriesFeed = (props) => {
    const [entries, updateEntries] = useState([]);
    useEffect(() => {
        fetch('/api')
            .then((data) => data.json())
            .then((data) => {
                updateEntries(data);
            })
            .catch((error) => console.log('Error:', error));
    }, [entries]);

    const pastEntries = entries.map((entry, i) => {
        return <PastEntry entry={entry} key={i} />;
    });

    return <div className="PastEntry">{pastEntries}</div>;
};

export default PastEntriesFeed;
