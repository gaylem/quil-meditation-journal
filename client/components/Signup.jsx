import React from 'react';

const SignUp = ({ setPageState }) => {
  const handlePageSwitch = () => {
    setPageState('login');
  };

  const handleSignup = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObject = Object.fromEntries(formData.entries());
    console.log(formDataObject);
    try {
      const response = await fetch('/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formDataObject.username,
          password: formDataObject.password,
        }),
      });
      if (response.ok) {
        setPageState('login');
      }
    } catch {
      console.log('not working');
    }
  };

  return (
    <div id='signupBody'>
      {/* // method & action are how frontend is linked to the back */}
      <h1 className='h1'>SIGNUP</h1>
      <form className='form' method='POST' onSubmit={handleSignup}>
        <input name='username' type='text' placeholder='Create Username' required /> <br />
        <input name='password' type='password' placeholder='Create Password' required /> <br />
        <input className='button' type='submit' value='Create Account'></input>
      </form>
      {/* <Link id='profileLink' className="links" to="/profile"><strong>PROFILE</strong></Link> */}
    </div>
  );
};

export default SignUp;
