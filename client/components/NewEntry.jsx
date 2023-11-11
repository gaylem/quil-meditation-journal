import React from 'react';
import '../scss/newEntry.scss';
import { useState } from 'react';
import moment from 'moment';

function NewEntry() {
    // TODAY'S DATE
    const now = moment();
    const [date, setDate] = useState('New Meditation');

    // TOGGLE DROPDOWN
    const [open, setOpen] = useState(false);
    const toggle = () => {
        setOpen(!open);
        if (open === false) setDate(now.format('LL'));
        if (open === true) setDate('New Meditation');
    };

    // HANDLE SUBMIT/SAVE
    const handleSubmit = (e) => {
        e.preventDefault();

        const body = document.getElementById('body').value;
        console.log(body);

        fetch('/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body })
        })
            .then((res) => {
                console.log(res);
                res.json();
            })
            .catch((error) => console.error('Error:', error));

        toggle();
    };

    return (
        <div className="NewEntry">
            <div className="buttonHeader">
                <button onClick={toggle}>+</button>
                <p>{date}</p>
            </div>
            <div className="form">
                {open && (
                    <div className="toggle">
                        <form method="post" onSubmit={handleSubmit}>
                            <textarea
                                className="entryText"
                                id="body"
                                name="body"
                                rows={10}
                                cols={30}
                            />
                            <div className="newEntryButtons">
                                <input
                                    id="cancel"
                                    type="submit"
                                    onClick={toggle}
                                    value="Cancel"
                                ></input>
                                <input id="save" type="submit" value="Save"></input>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NewEntry;
