import React, { useState } from 'react';

const LinkedinLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: '86y99ywcfln600',
        redirect_uri: 'http://localhost:4000/auth/linkedin/callback',
        scope: 'openid email profile',
    });
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`

  }

  return (
    <div>
      <button onClick={handleLogin}>
        {isLoading ? 'Redirecting to LinkedIn...' : 'Sign up with LinkedIn'}
      </button>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default LinkedinLogin;
// window.location.href = 'http://localhost:4000/auth/linkedin'; // Backend route
