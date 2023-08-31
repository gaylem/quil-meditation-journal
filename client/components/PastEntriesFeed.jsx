import React from 'react';
import { useState, useEffect } from 'react';
import PastEntry from './PastEntry';
import '../scss/pastEntriesFeed.scss';

const PastEntriesFeed = (props) => {
    // GET AND RENDER PAST ENTRIES
    const [entries, updateEntries] = useState([]);

    useEffect(() => {
        fetch('/api')
            .then((data) => data.json())
            .then((data) => {
                updateEntries(data);
                console.log(data);
            })
            .catch((error) => console.log('Error:', error));
    }, []);

    const pastEntries = entries.map((entry, i) => {
        return (
            <PastEntry
                entry={props.entry}
                body={entry.body}
                date={entry.createdAt}
                id={entry._id}
                key={i}
            />
        );
    });

    // REVERSE PAST ENTRIES SO RECENT IS AT TOP
    pastEntries.reverse();

    return (
        <div>
            <p className="pastMeditationTitle">Past Meditation Sessions</p>
            {pastEntries}
        </div>
    );
};

export default PastEntriesFeed;
