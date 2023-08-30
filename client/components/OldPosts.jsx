import React from 'react';
import { useState } from 'react';
import '../scss/oldPosts.scss';

const OldPosts = (props) => {
    const [open, setOpen] = useState(false);
    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div>
            <button onClick={toggle}>-</button>
            {open && (
                <div className="toggle">
                    <p>toggle</p>
                </div>
            )}
        </div>
    );
};
export default OldPosts;
