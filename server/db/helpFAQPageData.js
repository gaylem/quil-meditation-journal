//** Help & FAQ PAGE DATA */

import React from 'react';

const items = [
  {
    title: 'How do I use the meditation timer?',
    content: (
      <div>
        <ol>
          <li>
            <strong className='purple'>Set Duration.</strong> How long do you want to meditate? Select an option from the dropdown or enter a custom time in minutes.
          </li>
          <li>
            <strong className='purple'>Hit Play.</strong> Tap or click the play button to begin. It will change to a pause button while the timer is running. Click or tap it again to pause.
          </li>
          <li>
            <strong className='purple'>Restart If Needed</strong>. If you want to start over from scratch, hit the restart button. This will remove your Countdown and Duration selections and set the timer back to 0:00.
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: 'I forgot my username or password, how do I log in?',
    content: 'We are building a password reset process. For now, feel free to reach out to us through the contact form at the bottom of this page.',
  },
  {
    title: 'I accidentally deleted an entry, can I get it back?',
    content: 'Unfortuately, no. Clicking the "Delete" button on a journal entry permanently removes it from out database. If you have enountered any issues with this, please let us know.',
  },
  {
    title: 'Can anyone from quil read my journal entries?',
    content: (
      <div>
        <p>We fully encrypt your journal entries before storing them in our database. All we see is a random string of numbers and letters. While we have the ability to decrypt your entries, it is our policy not to, and access to the database is restricted. Furthermore, we follow security best practices to protect our database from exposure. </p>
        <br />
        <p>The best thing you can do to protect your journal from prying eyes is to use a secure password. Ideally, your password should be a random string of 12 or more characters long and include upper and lowercase letters, numbrs, and special characters. A password that meets these requirements would take around 200+ years to crack. </p>
        <br />
        <p>
          We also recommend using a password manager such as <a href='https://passwords.google.com/'>Google Password Manager</a>, <a href='https://support.apple.com/en-us/HT204085'>iCloud Keychain</a> or <a href='https://nordpass.com/'>Nordpass</a>. These tools often provide a password generator, which makes strong password creation quick and easy.
        </p>
      </div>
    ),
  },
  {
    title: 'What are you going to do with my email address?',
    content: 'We only use your email address for essential account-related communications, such as password resets. If you are interested in more communication, feel free to join our Discord server.',
  },
];

export default items;
