//** ABOUT PAGE */

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
const About = () => {
  return (
    <div className='page-container'>
      <BackButton />
      <h2>About quil</h2>
      <p>
        <span className='purple'>quil</span> is a portmanteau of the words "tranquil" and "quill," like the feather pen. It is your distraction-free space for chronicling your meditation journey.{' '}
      </p>
      <br />
      <p>Sure, you could use any other digital note-taking app instead, but the last thing you need when you&apos;re about to meditate is to glance at your to-do list.</p>
      <br />
      <p>
        That&apos;s also why quil steers clear of social sharing features and alerts. We know that true success in meditation lies in your ability to <span className='purple'>dedicate time and space</span> to your practice.
      </p>
      <br />
      <p>
        And with quil, your meditation journal is with you wherever you go, right on your phone or tablet. No need to remember to grab a notebook — you can <span className='purple'>capture and reflect on your mindfulness moments at any time.</span>
      </p>
      <br />
      <br />
      <h2>Safe & Secure</h2>
      <p>We recognize that your meditation journal contains your personal inner experiences and reflections. That's why we take privacy and security very seriously.</p>
      <br />
      <p>
        All journal entries are <span className='purple'>fully encrypted</span>, and we will <span className='purple'>never share or sell your data</span> to third parties. You can meditate with quil knowing your journal is confidential and seen only by you.
      </p>
      <br />
      <br />
      <h2>Open Source & Free To Use</h2>
      <p>
        quil is a <span className='purple'>free and open-source product</span> because meditation should be accessible to everyone who wants to learn regardless of their beliefs (or lack thereof).
      </p>
      <br />
      <br />
      <h2>Get Involved!</h2>
      <p>
        Whether you're an avid meditator or just beginning your practice, check out our{' '}
        <span>
          <a href='/community'>Community</a>
        </span>{' '}
        page for more information on how you can get involved.
      </p>
      <br />
      <br />
      <h2>Contact Us</h2>
      <p>
        If you encounter any issues with our app, have questions, or want to connect, please reach out through the form below. <span className='purple'>We&apos;d love to hear from you!</span>
      </p>
      <br />
      <ContactForm />
    </div>
  );
};

export default About;
