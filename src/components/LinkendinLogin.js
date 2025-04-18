import React from 'react';

const LinkedinLogin = () => {
  const handleLinkedInLogin = () => {
    window.location.href = 'http://localhost:4000/auth/linkedin'; // Backend route
  };

  return (
    <button onClick={handleLinkedInLogin}>
      Sign up with LinkedIn
    </button>
  );
};

export default LinkedinLogin;
