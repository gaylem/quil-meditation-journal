//** ACCOUNT PAGE */

import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';

// Import other libraries
import axios from '../axiosConfig.js';
import Cookies from 'js-cookie';

// Import data
import data from '../../server/db/accountPageData.js';
import BackButton from '../components/BackButton.jsx';

// Import styles
import '../scss/account-form.scss';

const Account = () => {
  const { user, dispatch } = useAuthContext();
  const initialItemStates = Array(2).fill(false);
  const [itemStates, setItemStates] = useState(initialItemStates);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});

  const toggle = index => {
    const newItemStates = [...itemStates];
    newItemStates[index] = !newItemStates[index];
    setItemStates(newItemStates);
  };

  const handleFormSubmit = async (index, formData, endpoint) => {
    try {
      // Declare response variable and initialize setError and setSuccess
      let response;
      setError({});
      setSuccess({});
      // Download journal entries
      if (endpoint === 'download') {
        try {
          response = await axios.post(
            `/api/accounts/download/${user.userId}`,
            {
              enterPassword: formData.enterPassword,
            },
            {
              responseType: 'blob',
              headers: {
                'Content-Type': 'application/json',
              },
            },
            {
              withCredentials: true,
            },
          );
          // If download === success
          if (response.status === 200) {
            // Download journal entries to browser
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my_entries.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            // Display success message on client
            setSuccess(success => {
              return { ...success, [index]: data[index].success };
            });
          }
        } catch (error) {
          // Handle rate limiting error
          if (error.response && error.response.status === 429) {
            setError(error => {
              return { ...error, [index]: 'Too many requests, please try again later.' };
            });
          } else {
            // Handle other errors
            console.error('Caught error:', error);
            setError(error => {
              return { ...error, [index]: data[index].error };
            });
          }
        }
        // Update username
      } else if (endpoint === 'username') {
        try {
          response = await axios.patch(
            `/api/accounts/username/${user.userId}`,
            {
              newUsername: formData.newUsername,
              password: formData.enterPassword,
            },
            {
              withCredentials: true,
            },
          );
          // If username update === success
          if (response.status === 200) {
            // Extract the updated user data from the response
            const updatedUsername = response.data;
            const newUserState = {
              username: updatedUsername,
              accessToken: user.accessToken,
              userId: user.userId,
            };
            // Dispatch the 'LOGIN' action with the updated user data
            Cookies.set('user', JSON.stringify(newUserState));
            dispatch({ type: 'LOGIN', payload: newUserState });
            setSuccess(success => {
              return { ...success, [index]: data[index].success };
            });
          }
        } catch (error) {
          // Handle rate limiting error
          if (error.response && error.response.status === 429) {
            setError(error => {
              return { ...error, [index]: 'Too many requests, please try again later.' };
            });
          } else {
            // Handle other errors
            console.error('Caught error:', error);
            setError(error => {
              return { ...error, [index]: data[index].error };
            });
          }
        }
        // Update email
      } else if (endpoint === 'email') {
        try {
          response = await axios.patch(
            `/api/accounts/email/${user.userId}`,
            {
              newEmail: formData.newEmail,
              password: formData.enterPassword,
            },
            {
              withCredentials: true,
            },
          );
          // if update email === success
          if (response.status === 200) {
            // set success message
            setSuccess(success => {
              return { ...success, [index]: data[index].success };
            });
            // if update email === fail
          }
        } catch (error) {
          // Handle rate limiting error
          if (error.response && error.response.status === 429) {
            setError(error => {
              return { ...error, [index]: 'Too many requests, please try again later.' };
            });
          } else {
            // Handle other errors
            console.error('Caught error:', error);
            setError(error => {
              return { ...error, [index]: data[index].error };
            });
          }
        }
        // Update password
      } else if (endpoint === 'pswd') {
        try {
          response = await axios.patch(
            `/api/accounts/pswd/${user.userId}`,
            {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
              confirmNewPassword: formData.confirmNewPassword,
            },
            {
              withCredentials: true,
            },
          );
          if (response.status === 204) {
            setSuccess(success => {
              return { ...success, [index]: data[index].success };
            });
            // Clear token from cookies
            Cookies.remove('user');
            // Redirect to the login page
            window.location.href = '/login';
          }
        } catch (error) {
          // Handle rate limiting error
          if (error.response && error.response.status === 429) {
            setError(error => {
              return { ...error, [index]: 'Too many requests, please try again later.' };
            });
          } else {
            // Handle other errors
            console.error('Caught error:', error);
            setError(error => {
              return { ...error, [index]: data[index].error };
            });
          }
        }
      } else if (endpoint === 'delete') {
        try {
          const response = await axios.delete(
            `/api/accounts/delete/${user.userId}`,
            {
              data: {
                password: formData.enterPassword,
              },
            },
            {
              withCredentials: true,
            },
          );
          if (response.status === 200) {
            setSuccess(success => {
              return { ...success, [index]: data[index].success };
            });
            // Clear token from cookies
            Cookies.remove('user');
            // Redirect to the signup page
            window.location.href = '/signup';
          }
        } catch (error) {
          console.error('Caught error:', error);
          setError(error => {
            return { ...error, [index]: data[index].error };
          });
        }
      } else {
        // Check if response is undefined or null
        if (!response) {
          throw new Error('Response is undefined or null');
        }
      }
    } catch (error) {
      console.error('Caught error:', error);
      setError(error => {
        return { ...error, [index]: data[index].error };
      });
    }
  };

  return (
    <div className='page-container'>
      <BackButton />
      <div className='page-text'>
        <h2>Account Settings</h2>
        You can manage your account settings below. If you have any questions, check out our <a href='/help-faqs'>Help & FAQs page.</a>
      </div>
      <div className='feed-container'>
        {data.map((item, index) => (
          <div className='toggle-entry' key={item.id}>
            <div className='toggle-header'>
              <button className='toggle-btn' onClick={() => toggle(index)}>
                +
              </button>
              <h3 className='toggle-title'>{item.title}</h3>
            </div>
            {itemStates[index] && (
              <div className='toggle-container'>
                <div className='toggle-text'>{item.content}</div>
                <div className='account-form-container'>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const formData = {};
                      item.formFields.forEach(field => {
                        formData[field.name] = e.target[field.name + index].value;
                      });
                      handleFormSubmit(index, formData, item.endpoint);
                    }}
                    className='form'>
                    {item.formFields.map((field, fieldIndex) => (
                      <div className='input-box' key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <input key={fieldIndex} id={field.id} type={field.type || 'text'} name={`${field.name}${index}`} placeholder={field.placeholder} className='formField' />
                      </div>
                    ))}
                    <button type='submit' className='form-btn'>
                      {`${item.buttonText}`}
                    </button>
                    {error[index] && <div className='error-message'>{error[index]}</div>}
                    {success[index] && <div className='success-message'>{success[index]}</div>}
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Account;
