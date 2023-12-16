//** HELP & FAQs PAGE */

import React, { useState } from 'react';

/**
 * React component for the Help & FAQs page.
 *
 * This page provides helpful information and frequently asked questions
 * There is a contact form at the end.
 *
 * @returns {JSX.Element} The rendered Help & FAQs page component.
 */
const HelpFAQ = () => {
  const initialQuestionStates = Array(4).fill(false); // Assuming you have 4 questions initially
  const [questionStates, setQuestionStates] = useState(initialQuestionStates);

  const toggle = index => {
    const newQuestionStates = [...questionStates];
    newQuestionStates[index] = !newQuestionStates[index];
    setQuestionStates(newQuestionStates);
  };

  const questions = [
    {
      title: 'Question 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      title: 'Question 2',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      title: 'Question 3',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      title: 'Question 4',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  return (
    <div className='pageContainer'>
      <div className='pageContent'>
        <h2>Help & FAQs</h2>
        <p>Here are some questions and answers if you need any help. If you don't find what you're looking for here, scroll down and reach out via the contact form at the bottom of the page.</p>
        <br />
        <div className='helpContainer'>
          {questions.map((question, index) => (
            <div className='questionContainer' key={index}>
              <div className='questionHeader'>
                <button onClick={() => toggle(index)}>+</button>
                <p className='questionTitle'>{question.title}</p>
              </div>
              {questionStates[index] && (
                <div className='toggleQuestionContainer'>
                  <div className='questionText'>
                    <p className='questionTextP'>{question.content}</p>
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
