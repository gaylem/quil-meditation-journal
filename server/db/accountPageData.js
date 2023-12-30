//** ACCOUNT PAGE DATA */

import React from 'react';

const items = [
  {
    title: 'Download your journal entries',
    content: 'Enter your password and click "Download Journal Entries" to download a .csv file containing all your journal entries.',
    formFields: [
      {
        label: 'Password:',
        for: 'downloadPassword',
        id: 'downloadPassword',
        name: 'enterPassword',
        type: 'password',
        placeholder: 'Enter your password',
      },
    ],
    buttonText: 'Download journal entries',
    endpoint: 'download',
    success: 'Journal entries downloaded successfully.',
    error: 'Download failed. Please try again.',
  },
  {
    title: 'Update your username',
    content: 'Enter your new username and current password below to update your username. Make sure to remember your new username. If you use a password manager, update it immediately.',
    formFields: [
      {
        label: 'New Username',
        for: 'username',
        id: 'username',
        name: 'newUsername',
        placeholder: 'ex: jane',
      },
      {
        label: 'Password:',
        for: 'usernamePassword',
        id: 'usernamePassword',
        name: 'enterPassword',
        type: 'password',
        placeholder: 'Enter your password',
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
        label: 'New Email',
        for: 'newEmail',
        id: 'newEmail',
        name: 'newEmail',
        type: 'email',
        placeholder: 'ex: janedoe@example.com',
      },
      {
        label: 'Password:',
        for: 'emailPassword',
        id: 'emailPassword',
        name: 'enterPassword',
        type: 'password',
        placeholder: 'Enter your password',
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
          Your new password must be <strong>at least 8 characters long</strong> and contain the following:
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
          Be sure to remember your new password. We recommend using a password manager such as <a href='https://passwords.google.com/'>Google Password Manager</a>, <a href='https://support.apple.com/en-us/HT204085'>iCloud Keychain</a> or <a href='https://nordpass.com/'>Nordpass</a>. These tools often provide a password generator, which makes strong password creation quick and easy.
        </p>
        <br />
      </div>
    ),
    formFields: [
      {
        label: 'Current Password:',
        for: 'currentPassword',
        id: 'currentPassword',
        name: 'currentPassword',
        type: 'password',
        placeholder: 'Enter your current password',
      },
      {
        label: 'New Password:',
        for: 'newPassword',
        id: 'newPassword',
        name: 'newPassword',
        type: 'password',
        placeholder: 'Enter your new password',
      },
      {
        label: 'Confirm New Password:',
        for: 'confirmNewPassword',
        id: 'confirmNewPassword',
        name: 'confirmNewPassword',
        type: 'password',
        placeholder: 'Confirm your new password',
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
          Deleting your account will <strong>permanently erase all of your data from our database.</strong> This action cannot be reversed. If you truly want to delete your account, we recomend that you <strong>download your journal entries first.</strong>
        </p>
        <br />
        <p>
          If you have downloaded your entries and are still sure you want to delete your account, enter your password below and click "Delete Account." We will redirect you to the signup page, and <strong>your account will no longer exist.</strong>
        </p>
        <br />
      </div>
    ),
    formFields: [
      {
        label: 'Password:',
        for: 'deleteAccountPassword',
        id: 'deleteAccountPassword',
        name: 'enterPassword',
        type: 'password',
        placeholder: 'Enter your password',
      },
    ],
    buttonText: 'Delete Account',
    endpoint: 'delete',
    success: 'User account deleted successfully.',
    error: 'Account deletion failed. Please try again.',
  },
];

export default items;
