//** COMMUNITY PAGE */

import React from 'react';
import ContactForm from '../components/ContactForm.jsx';
import BackButton from '../components/BackButton.jsx';
import '../scss/page.scss';

/**
 * React component for the About page.
 *
 * This page provides information about the quil meditation journal app.
 * It includes details about the app's purpose and features.
 * There is a contact form at the end.
 *
 * @returns {JSX.Element} The rendered About page component.
 */
const Community = () => {
  return (
    <div className='page-container'>
      <BackButton />
      <h2>Join Our Community</h2>
      <p>
        Join our community on{' '}
        <span className='purple'>
          <a href='https://discord.gg/ph8YBz9Xnn' target='_blank'>
            Discord
          </a>
        </span>{' '}
        to discuss meditation, provide valuable feedback, and have fun!
      </p>
      <br />
      <br />
      <h2>For Software Engineers</h2>
      <p>
        Because quil is an open-source product, <span className='purple'>we&apos;re contribution friendly!</span>
      </p>
      <br />
      <p>
        If you&apos;re a software developer, and you&apos;d like to help make quil the best it can be, join the Discord above and check out our{' '}
        <span className='purple'>
          <a href='https://github.com/gaylem/quil-meditation-journal' target='_blank'>
            GitHub
          </a>
        </span>{' '}
        for more information on how you can participate.
      </p>
      <br />
      <br />
      <h2>Contact Us!</h2>
      <ContactForm />
    </div>
  );
};

export default Community;
