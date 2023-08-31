import React from 'react';
import '../scss/oldPosts.scss';

const OldPostEntries = (props) => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    <div className="OldPost">
        <div className="buttonHeader">
            <button onClick={toggle}>+</button>
            <p>{props.entry.createdAt}</p>
        </div>
        <div className="form">{open && <div className="toggle"></div>}</div>
    </div>;
};
export default OldPostEntries;
