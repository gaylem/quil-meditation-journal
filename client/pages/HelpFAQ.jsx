//** HELP & FAQs PAGE */

import React, { useState } from 'react';
import items from '../../server/db/helpFAQPageData';
/**
 * React component for the Help & FAQs page.
 *
 * This page provides helpful information and frequently asked questions
 * There is a contact form at the end.
 *
 * @returns {JSX.Element} The rendered Help & FAQs page component.
 */
const HelpFAQ = () => {
  const initialItemStates = Array(4).fill(false); // Assuming you have 4 questions initially
  const [itemStates, setItemStates] = useState(initialItemStates);

  const toggle = index => {
    const newItemStates = [...itemStates];
    newItemStates[index] = !newItemStates[index];
    setItemStates(newItemStates);
  };

  return (
    <div className='pageContainer'>
      <div className='pageContent'>
        <h2>Help & FAQs</h2>
        <p>Here are some questions and answers if you need any help. If you don't find what you're looking for here, scroll down and reach out via the contact form at the bottom of the page.</p>
        <br />
        <div className='helpContainer'>
          {items.map((item, index) => (
            <div className='itemContainer' key={index}>
              <div className='itemHeader'>
                <button onClick={() => toggle(index)}>+</button>
                <p className='itemTitle'>{item.title}</p>
              </div>
              {itemStates[index] && (
                <div className='toggleItemContainer'>
                  <div className='itemText'>
                    <p className='itemTextP'>{item.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <br />
        <h2>Still need help?</h2>
        <p>Reach out via the form below.</p>
        <div className='contactFormContainer'>
          <form action={process.env.REACT_APP_FORM_ENDPOINT} method='POST' className='form'>
            <input type='text' name='name' placeholder='Name' className='name' />
            <input type='hidden' name='_gotcha' style={{ display: 'none !important' }} />
            <input type='text' name='email' placeholder='Email' className='email' />
            <textarea type='text' name='message' placeholder='Message' rows='10' className='message' />
            <button type='submit' className='submitBtn'>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpFAQ;
