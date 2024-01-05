//** CONTACT FORM */

import React from 'react';

/**
 * Contact form component allows users to submit messages.
 *
 * @returns {JSX.Element} The rendered Blurb component.
 */
function ContactForm() {
  return (
    <div className='contact-form-container'>
      <form action='https://getform.io/f/26155a73-618a-4442-bac8-7a66c744534a' method='POST' className='form'>
        <label htmlFor='name'>Your Name:</label>
        <input type='text' name='name' id='name' placeholder='ex: Jane Doe' className='name' />
        <div className='visually-hidden'>
          <label htmlFor='hidden'>Leave this field empty:</label>
          <input type='text' id='hidden' name='_gotcha' />
        </div>
        <label htmlFor='email'>Your Email:</label>
        <input type='text' name='email' id='email' placeholder='janedoe@example.com' className='email' />
        <label htmlFor='message'>Message:</label>
        <textarea type='text' name='message' id='message' placeholder="What's on your mind?" rows='10' className='message' />
        <button type='submit' className='form-btn'>
          Send
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
