//** LOGIN/SIGNUP PAGE BLURB */

import React from 'react';

/**
 * Blurb component provides the same copy on the Login and Signup pages.
 *
 * @returns {JSX.Element} The rendered Blurb component.
 */
function Blurb() {
  return (
    <div className='about'>
      {/* First paragraph of about section */}
      <div className='paragraph'>
        <p>quil is inspired by the words &quot;tranquil&quot; and &quot;quill,&quot; as in the classic feather pen. Sign up or log in to discover your own dedicated space, where you can chronicle each step of your meditation journey.</p>
      </div>
      {/* Second paragraph of about section */}
      <div>
        <p>Every entry you record in your account is encrypted to ensure absolute privacy and confidentiality. Put your mind at ease and your worries aside, and immerse yourself fully in the transformative experience of meditation. We hope we can help your innermost thoughts find a safe harbor amid the turbulent waves of life.</p>
      </div>
    </div>
  );
}

export default Blurb;
