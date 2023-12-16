import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
// Import axios for handling server requests
import axios from '../axiosConfig.js';

import items from '../../server/db/accountPageData.js'

const Account = () => {
  const { user } = useAuthContext();
  const initialItemStates = Array(2).fill(false);
  const [itemStates, setItemStates] = useState(initialItemStates);

  const toggle = index => {
    const newItemStates = [...itemStates];
    newItemStates[index] = !newItemStates[index];
    setItemStates(newItemStates);
  };

const handleFormSubmit = async (index, formData, method, endpoint) => {
  try {
    let response;

    if (endpoint === 'download') {
      // Adjust the method to POST or PUT for file downloads
      response = await axios.get(`/api/accounts/download/${user.userId}`, {
        responseType: 'blob', // Set the response type to blob for file downloads
      });
    } else {
      response = await axios.get(`/api/accounts/${endpoint}/${user.userId}`, {
        method: `${method}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
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
    console.error('Error:', error);
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
                        handleFormSubmit(index, formData, item.method, item.endpoint);
                      }}
                      className='form'>
                      {item.formFields.map((field, fieldIndex) => (
                        <input key={fieldIndex} type={field.type || 'text'} name={`${field.name}${index}`} placeholder={field.placeholder} className='formField' />
                      ))}
                      <button type='submit' className='submitBtn'>
                        {`${item.buttonText}`}
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
