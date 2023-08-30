import React from 'react';
import { useState, useEffect } from 'react';
import moment from 'moment';
import '../scss/oldPosts.scss';

const OldPosts = (props) => {
    const [date, setDate] = useState('New Post');
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        fetch('/api')
            .then((res) => {
                console.log(res);
                res.json();
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const body = document.getElementById('body').value;
    //     console.log(body);

    //     fetch('/api', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ body })
    //     })
    //         .then((res) => {
    //             console.log(res);
    //             res.json();
    //         })
    //         .catch((error) => console.error('Error:', error));
    // };

    return (
        <div className="OldPost">
            <div className="buttonHeader">
                <button onClick={toggle}>+</button>
                <p>{date}</p>
            </div>
            <div className="form">{open && <div className="toggle">test</div>}</div>
        </div>
    );
};
export default OldPosts;
