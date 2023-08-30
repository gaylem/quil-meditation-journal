import React, { useEffect, useState } from 'react';
import NewPost from './NewPost';
import OldPosts from './OldPosts';
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
            <NewPost />
            <hr />
            <OldPosts label="Old journal entry" />
        </div>
    );
}

export default EntryContainer;
