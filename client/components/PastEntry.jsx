import React, { useState } from 'react';
import '../scss/pastEntry.scss';

const PastEntry = (props) => {
    const [open, setOpen] = useState(false);
    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div className="NewEntry">
            <div className="buttonHeader">
                <button onClick={toggle}>+</button>
                <p>{props.entry.createdAt}</p>
            </div>
            <div>
                {open && (
                    <div className="toggle">
                        <p>{props.entry.body}</p>
                        <div className="pastEntryButtons">
                            <input id="cancel" type="submit" value="Delete"></input>
                            <input id="save" type="submit" value="Edit"></input>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PastEntry;
