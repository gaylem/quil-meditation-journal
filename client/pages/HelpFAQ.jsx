//** HELP & FAQs PAGE */

import React, { useState } from 'react';
import items from '../../server/db/helpFAQPageData';
import ContactForm from '../components/ContactForm.jsx';
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
        <div className='page-text'>
          <h2>Help & FAQs</h2>
          <p>Here are some questions and answers if you need any help. If you don't find what you're looking for here, scroll down and reach out via the contact form at the bottom of the page.</p>
        </div>
        <div className='feed-container'>
          {items.map((item, index) => (
            <div className='toggle-entry' key={index}>
              <div className='toggle-header'>
                <button onClick={() => toggle(index)}>+</button>
                <h3 className='toggle-title'>{item.title}</h3>
              </div>
              {itemStates[index] && (
                <div className='toggle-container'>
                  <div className='toggle-text'>
                    <p>{item.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='page-text'>
          <h2>Still need help?</h2>
          <p>Reach out via the form below.</p>
        </div>
        <div className='feed-container'>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default HelpFAQ;
