//** ACCOUNT PAGE DATA */
const items = [
    {
      title: 'Download data',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      formFields: [],
      buttonText: 'Download journal entries',
      endpoint: `download`,
      method: 'GET',
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
      method: 'PATCH',
      endpoint: 'username',
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
      method: 'PATCH',
      endpoint: 'email',
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
      method: 'PATCH',
      endpoint: 'pswd',
    },
    {
      title: 'Delete Account',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      formFields: [],
      buttonText: 'Delete Account',
      method: 'DELETE',
      endpoint: 'delete-account',
    },
];

export default items;