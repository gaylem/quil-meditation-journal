import React from 'react';
import NewEntry from './NewEntry';
import PastEntriesFeed from './PastEntriesFeed';
import '../scss/entryContainer.scss';

function EntryContainer() {
    return (
        <div className="EntryContainer">
            <div className="quote-block">
                <p id="quote">
                    Listening to and understanding our inner sufferings will resolve most of the
                    problems we encounter.
                </p>
                <p id="author">Thich Nhat Hanh</p>
            </div>
            <NewEntry />
            <hr />
            <PastEntriesFeed />
        </div>
    );
}

export default EntryContainer;
