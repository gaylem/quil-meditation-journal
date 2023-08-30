import React from 'react';
import '../scss/newPost.scss';
import { useState } from 'react';
import moment from 'moment';

function NewPost() {
    const now = moment();
    const [date, setDate] = useState('New Post');
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
        setDate(now.format('ll'));
    };

    return (
        <div className="NewPost">
            <p>
                <button onClick={toggle}>+</button>
                <p>{date}</p>
            </p>
            <div className="form">
                {open && (
                    <div className="toggle">
                        <form>
                            <input className="entryText" type="text" id="body" />
                            <div className="newPostButtons">
                                <input id="cancel" type="submit" value="Cancel"></input>
                                <input id="save" type="submit" value="Save"></input>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NewPost;
