import React from 'react';
import '../scss/pastEntries.scss';

const PastEntryList = (props) => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    <div className="PastEntry">
        <div className="buttonHeader">
            <button onClick={toggle}>+</button>
            <p>{props.entry.createdAt}</p>
        </div>
        <div className="form">{open && <div className="toggle"></div>}</div>
    </div>;
};
export default PastEntryList;
