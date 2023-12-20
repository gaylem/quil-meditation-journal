//** ACCOUNT PAGE DATA */

import React from 'react';

const items = [
  {
    title: 'Download your journal entries',
    content: 'Enter your password and click "Download Journal Entries", to download a .csv file containing all of your journal entries.',
    formFields: [
      {
        name: 'enterPassword',
        type: 'password',
        placeholder: 'Enter Password',
      },
    ],
    buttonText: 'Download journal entries',
    endpoint: 'download',
    success: 'Journal entries downloaded successfully.',
    error: 'Download failed. Please try again.',
  },
  {
    title: 'Update your username',
    content: 'Enter your new username and current password below to update your username. Make sure to remember your new username. If you use a password manager, update it there immediately.',
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
    endpoint: 'username',
    success: 'Username updated successfully.',
    error: 'Username update failed. Please try again.',
  },
  {
    title: 'Update your email',
    content: 'Enter your new email address and current password below to update your email address.',
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
    buttonText: 'Update Email',
    endpoint: 'email',
    success: 'Email successfully updated.',
    error: 'Email update failed. Please try again.',
  },
  {
    title: 'Update your password',
    content: (
      <div>
        <p>Enter your current password and new password below to update your password.</p>
        <br />
        <p>
          Your new password must be <strong>at least 12 characters long</strong> and contain the following:
        </p>
        <br />
        <ul>
          <li>1 uppercase letter</li>
          <li>1 lowercase letter</li>
          <li>1 number</li>
          <li>1 symbol</li>
          <br />
        </ul>
        <p>However, more of each is better from a security standpoint.</p>
        <br />
        <p>Once you enter your new password, you will be logged out and prompted to log back in again.</p>
        <br />
        <p>
          Be sure to remember your new password. We recommend using a password manager, such as <a href='https://passwords.google.com/'>Google Password Manager</a>, <a href='https://support.apple.com/en-us/HT204085'>iCloud Keychain</a> or <a href='https://nordpass.com/'>Nordpass</a>. These tools often provide a password generator, making the process of coming up with a secure, random password much easier.
        </p>
        <br />
      </div>
    ),
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
    buttonText: 'Update Password',
    endpoint: 'pswd',
    success: 'Password updated successfully.',
    error: 'Password update failed. Please try again.',
  },
  {
    title: 'Delete your account',
    content: (
      <div>
        <p>
          If you delete your your account, <strong>all of your data will be permenantly erased from our database.</strong> This action cannot be undone. We recommend that if you truly want to delete your account, you <strong>download your journal entries first.</strong>
        </p>
        <br />
        <p>If you have downloaded your data and are still sure you want to delete your account, enter your password below and click "Delete Account."</p>
        <br />
        <p>
          When you are done, <strong>you will be redirected to the signup page, and your account will no longer exist.</strong>
        </p>
        <br />
      </div>
    ),
    formFields: [
      {
        name: 'enterPassword',
        type: 'password',
        placeholder: 'Enter Password',
      },
    ],
    buttonText: 'Delete Account',
    endpoint: 'delete',
    success: 'User account deleted successfully.',
    error: 'Account deletion failed. Please try again.',
  },
];

export default items;