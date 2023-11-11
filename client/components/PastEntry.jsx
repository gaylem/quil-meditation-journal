import React, { useState } from 'react';
import '../scss/pastEntry.scss';
import moment from 'moment';

const PastEntry = (props) => {
    // TOGGLE ENTRY
    const [open, setOpen] = useState(false);
    const toggle = () => {
        setOpen(!open);
    };

    // FORMAT DATE
    const createdDate = props.date;
    const formattedDate = moment(createdDate).format('LL');

    // HANDLE DELETE
    const handleDelete = (e) => {
        e.preventDefault();

        fetch(`entries/${props.id}`, {
            method: 'DELETE',
            body: JSON.stringify(props.entry)
        })
            .then((res) => {
                res.json();
                console.log(res._id);
            })
            .catch((error) => console.error('Error:', error));

        toggle();
    };

    // TODO: HANDLE EDIT - Button works when I have postman opened
    const handleEdit = (e) => {
        e.preventDefault();

        fetch(`entries/${props.id}`, {
            method: 'PATCH'
        })
            .then((res) => {
                res.json();
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="PastEntry">
            <div className="buttonHeaderPast">
                <button onClick={toggle}>+</button>
                <p>{formattedDate}</p>
            </div>
            <div>
                {open && (
                    <div className="toggle">
                        <p className="pastEntryText">{props.body}</p>
                        <div className="pastEntryButtons">
                            <input
                                id="cancel"
                                type="submit"
                                onClick={handleDelete}
                                value="Delete"
                            ></input>
                            <input
                                id="save"
                                type="submit"
                                onClick={handleEdit}
                                value="Edit"
                            ></input>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PastEntry;
