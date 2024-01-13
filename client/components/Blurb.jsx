//** LOGIN & SIGNUP PAGE BLURB */

import React from 'react';

/**
 * Blurb component provides the same copy on the Login and Signup pages.
 *
 * @returns {JSX.Element} The rendered Blurb component.
 */
function Blurb() {
  return (
    <div className='about'>
      <h2>Pen your meditation story.</h2>
      <div className='paragraph'>
        <p>quil blends the words &quot;tranquil&quot; and &quot;quill,&quot; as in the classic feather pen. Sign up or log in to discover your own dedicated space, where you can chronicle each step of your meditation journey in a private journal.</p>
      </div>
      <div>
        <p>Each entry you write is encrypted to ensure absolute privacy and confidentiality. Put your mind at ease and immerse yourself fully in the transformative experience of meditation.</p>
      </div>
    </div>
  );
}

export default Blurb;
