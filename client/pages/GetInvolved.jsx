//** ABOUT PAGE */

import React from 'react';
import ContactForm from '../components/ContactForm.jsx';

/**
 * React component for the About page.
 *
 * This page provides information about the quil meditation journal app.
 * It includes details about the app's purpose and features.
 * There is a contact form at the end.
 *
 * @returns {JSX.Element} The rendered About page component.
 */
const About = () => {
  return (
    <div className='page-container'>
      <h2>Get Involved!</h2>
      <p>
        Because quil is an open-source product, <span className='purple'>we&apos;re contribution friendly!</span> If you&apos;re a software developer, and you&apos;d like to help make quil the best it can be, check out our{' '}
        <span className='purple'>
          <a href='https://github.com/gaylem/quil-meditation-journal'>GitHub</a>
        </span>{' '}
        for more information on how you can participate.
      </p>
      <br />
      <h2>Questions?</h2>
      <p>
        If you encounter any issues with our app, have any questions, or just want to connect, please reach out through the form below. <span className='purple'>We&apos;d love to hear from you!</span>
      </p>
      <br />
      <h2>Contact Us!</h2>
      <ContactForm />
    </div>
  );
};

export default About;
