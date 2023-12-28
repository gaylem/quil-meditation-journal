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
      <h2>About quil</h2>
      <p>
        <span className='purple'>quil</span> is your distraction-free space for chronicling your meditation journey.
      </p>
      <br />
      <p>Sure, you could use any other digital note-taking app instead, but the last thing you need when you&apos;re about to meditate is to glance at your to do list.</p>
      <br />
      <p>
        That&apos;s also why quil also steers clear of social sharing features and alerts. We know that true success in meditation lies in your ability to <span className='purple'>dedicate time and space</span> to your practice.
      </p>
      <br />
      <p>
        And with quil, your meditation journal is with you wherever you go, right on your phone or tablet. No need to remember to grab a notebook — you can <span className='purple'>capture and reflect on your mindfulness moments at any time.</span>
      </p>
      <br />
      <h2>Safe & Secure</h2>
      <p>We recognize that your meditation journal contains your personal inner experiences and reflections, which is why we take privacy and security very seriously.</p>
      <br />
      <p>
        All journal entries are <span className='purple'>fully encrypted</span>, and we will <span className='purple'>never share or sell your data</span> to third parties. You can meditate with quil knowing your journal is completely confidential and seen only by you.
      </p>
      <br />
      <h2>Open Source & Free To Use</h2>
      <p>
        quil is also an <span className='purple'>open-source product</span>, which is why we can offer it to the public at no cost. We believe that <span className='purple'>meditation should be free and accessible to everyone</span> who wants to learn regardless of their beliefs (or lack thereof).
      </p>
      <br />
      <p>
        We also hope that, in addition to sharing the benefits of meditation with others, quil will also foster <span className='purple'>growth and collaboration</span> within the open source software community.
      </p>
      <br />
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
