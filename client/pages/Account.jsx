import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
// Import axios for handling server requests
import axios from '../axiosConfig.js';

import items from '../../server/db/accountPageData.js'

const Account = () => {
  const { user, dispatch } = useAuthContext();
  const initialItemStates = Array(2).fill(false);
  const [itemStates, setItemStates] = useState(initialItemStates);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const toggle = index => {
    const newItemStates = [...itemStates];
    newItemStates[index] = !newItemStates[index];
    setItemStates(newItemStates);
  };

  const handleFormSubmit = async (formData, endpoint) => {
  
  try {
    let response;
    setError('');
    setSuccess('');

    if (endpoint === 'download') {
      response = await axios.post(`/api/accounts/download/${user.userId}`, {
     enterPassword: formData.enterPassword,
    }, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
      });
      
      if (response.status === 200) {
        // Remove user data from local storage
        localStorage.removeItem('user');
        setSuccess('Journal entries successfully downloaded.');
      } else {
        setError('Download failed. Please try again.');
      }
    } else if (endpoint === 'username') {
      response = await axios.patch(`/api/accounts/username/${user.userId}`, {
        newUsername: formData.newUsername,
        password: formData.enterPassword,
      });
      if (response.status === 200) {
        // Extract the updated user data from the response
        const updatedUsername = response.data;
        const newUserState = {
          username: updatedUsername,
          accessToken: user.accessToken,
          userId: user.userId
        }
        // Dispatch the 'LOGIN' action with the updated user data
        localStorage.setItem('user', JSON.stringify(newUserState));
        dispatch({ type: 'LOGIN', payload: newUserState });setSuccess('Email successfully updated.');
      } else {
        setError('Username update failed. Please try again.');
      }  
    } else if (endpoint === 'email') {
      response = await axios.patch(`/api/accounts/email/${user.userId}`, {
        newEmail: formData.newEmail,
        password: formData.enterPassword,
      });
      if (response.status === 200) {
        // Remove user data from local storage
        localStorage.removeItem('user');
        setSuccess('Email successfully updated.');
      } else {
        setError('Email update failed. Please try again.');
      }
    } else if (endpoint === 'pswd') {
       response = await axios.patch(`/api/accounts/pswd/${user.userId}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
       });
      if (response.status === 204) {
        setSuccess('Password successfully updated.');
      } else {
        setError('Account deletion failed. Please try again.');
      }
    } else if (endpoint === 'delete') {
      response = await axios.delete(`/api/accounts/delete/${user.userId}`);
       if (response.status === 200) {
        // Remove user data from local storage
        localStorage.removeItem('user');
        // Redirect to the signup page or any other desired URL
        window.location.href = '/signup';
      } else {
        // Handle other response statuses as needed
        
      }
    }

    // Check if response is undefined or null
    if (!response) {
      throw new Error('Response is undefined or null');
    }
    // Check the HTTP status code directly
    if (response.status !== 200) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    // Handle the response based on the endpoint
    if (endpoint === 'download') {
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my_entries.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      const data = await response.data; 
    }
  } catch (error) {
    
  }
};

  return (
    <div className='pageContainer'>
      <div className='pageContent'>
        <h2>Account Settings</h2>
        <p>You can manage your account settings below.</p>
        <br />
        <div className='helpContainer'>
          {items.map((item, index) => (
            <div className='itemContainer' key={index}>
              <div className='itemHeader'>
                <button onClick={() => toggle(index)}>+</button>
                <p className='itemTitle'>{item.title}</p>
              </div>
              {itemStates[index] && (
                <div className='toggleItemContainer'>
                  <div className='itemText'>
                    <p className='itemTextP'>{item.content}</p>
                  </div>
                  <div className='accountFormContainer'>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const formData = {};
                        item.formFields.forEach(field => {
                          formData[field.name] = e.target[field.name + index].value;
                        });
                        handleFormSubmit(formData, item.endpoint);
                      }}
                      className='form'>
                      {item.formFields.map((field, fieldIndex) => (
                        <input key={fieldIndex} type={field.type || 'text'} name={`${field.name}${index}`} placeholder={field.placeholder} className='formField' />
                      ))}
                      <button type='submit' className='submitBtn'>
                        {`${item.buttonText}`}
                      </button>
                      {error && <div className="error-message">{error}</div>}
                      {success && <div className="success-message">{success}</div>}
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
