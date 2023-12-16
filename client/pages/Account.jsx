import React, { useState } from 'react';

const Account = () => {
  const initialQuestionStates = Array(2).fill(false);
  const [questionStates, setQuestionStates] = useState(initialQuestionStates);

  const toggle = index => {
    const newQuestionStates = [...questionStates];
    newQuestionStates[index] = !newQuestionStates[index];
    setQuestionStates(newQuestionStates);
  };

  const handleFormSubmit = (index, formData, endpoint) => {
    fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/account/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const questions = [
    {
      title: 'Download data',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      formFields: [],
      buttonText: 'Download journal entries',
      // TODO: Update when routes are built
      endpoint: 'downloadData',
    },
    {
      title: 'Update Username',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      formFields: [
        {
          name: 'newUsername',
          placeholder: 'New Username',
        },
        {
          name: 'enterPassword',
          type: 'password',
          placeholder: 'Enter Password',
        },
      ],
      buttonText: 'Update Username',
      // TODO: Update when routes are built
      endpoint: 'updateUsername',
    },
    {
      title: 'Change Password',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      formFields: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Current Password',
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password',
        },
        {
          name: 'confirmNewPassword',
          type: 'password',
          placeholder: 'Confirm New Password',
        },
      ],
      buttonText: 'Change Password',
      // TODO: Update when routes are built
      endpoint: 'updatePassword',
    },
    {
      title: 'Change Email',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      formFields: [
        {
          name: 'newEmail',
          type: 'email',
          placeholder: 'New Email',
        },
        {
          name: 'enterPassword',
          type: 'password',
          placeholder: 'Enter Password',
        },
      ],
      buttonText: 'Change Password',
      // TODO: Update when routes are built
      endpoint: 'changeEmail',
    },
    {
      title: 'Delete Account',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      formFields: [],
      buttonText: 'Delete Account',
      // TODO: Update when routes are built
      endpoint: 'deleteAccount',
    },
  ];

  return (
    <div className='pageContainer'>
      <div className='pageContent'>
        <h2>Account Settings</h2>
        <p>You can manage your account settings below.</p>
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
                  <div className='accountFormContainer'>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const formData = {};
                        question.formFields.forEach(field => {
                          formData[field.name] = e.target[field.name + index].value;
                        });
                        handleFormSubmit(index, formData, question.endpoint);
                      }}
                      className='form'>
                      {question.formFields.map((field, fieldIndex) => (
                        <input key={fieldIndex} type={field.type || 'text'} name={`${field.name}${index}`} placeholder={field.placeholder} className='formField' />
                      ))}
                      <button type='submit' className='submitBtn'>
                        {`${question.buttonText}`}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <p>
          If you have any questions, checkout our <a href='/help-faqs'>Help & FAQs page.</a>
        </p>
      </div>
    </div>
  );
};

export default Account;
