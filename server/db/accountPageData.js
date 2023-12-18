//** ACCOUNT PAGE DATA */
const items = [
  {
    title: 'Download data',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    formFields: [
      {
        name: 'enterPassword',
        type: 'password',
        placeholder: 'Enter Password',
      },
    ],
    buttonText: 'Download journal entries',
    endpoint: 'download',
    success: 'Journal entries successfully downloaded.',
    error: 'Download failed. Please try again.',
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
    endpoint: 'username',
    success: 'Username successfully updated.',
    error: 'Username update failed. Please try again.',
  },
  {
    title: 'Update Email',
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
    buttonText: 'Update Email',
    endpoint: 'email',
    success: 'Email successfully updated.',
    error: 'Email update failed. Please try again.',
  },
  {
    title: 'Update Password',
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
    buttonText: 'Update Password',
    endpoint: 'pswd',
    success: 'Password successfully updated.',
    error: 'Password update failed. Please try again.',
  },
  {
    title: 'Delete Account',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
