// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
// import Signup from './components/Signup';
// import Login from './components/Login';
// import Home from './components/Home';
// import Gooauth from './components/Gooauth';
// import './App.css';

// import LinkedinLogin from './components/LinkendinLogin';

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [username, setUsername] = useState('');

//   const checkAuth = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/auth/check-auth', {
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (data.authenticated) {
//         localStorage.setItem('token', data.token);
//         setIsAuthenticated(true);
//         setUsername(data.user.username);
//       }
//     } catch (error) {
//       console.error('Error checking auth:', error);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <GoogleOAuthProvider clientId="928939603188-ofv91jabatl58dem7upp1tr2sh9kvvce.apps.googleusercontent.com"> {/* Replace with your Google Client ID */}
//       <Router>
//         <div className="app">
//           <h1>Authentication App</h1>
//           <Routes>
//             <Route path="/login" element={
//               isAuthenticated ? <Navigate to="/home" replace /> : <Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
//             } />
//             <Route path="/signup" element={
//               isAuthenticated ? <Navigate to="/home" replace /> : <Signup />
              
//             } />
//             <Route path="/home" element={
//               isAuthenticated ? <Home username={username} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />
//             } />
//             <Route path="/" element={
//               isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
//             } />
//           </Routes>
//           <Gooauth />
//           <LinkedinLogin/>
//         </div>
//       </Router>
//     </GoogleOAuthProvider>
//   );
// };

// export default App;






import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Gooauth from './components/Gooauth';
import LinkedinLogin from './components/LinkendinLogin';
import './App.css';

const AuthButtons = () => {
  const location = useLocation();
  const showAuthButtons = location.pathname === "/signup" || location.pathname === "/login";

  return (
    showAuthButtons && (
      <>
        <Gooauth />
        <LinkedinLogin />
      </>
    )
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/check-auth', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.authenticated) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUsername(data.user.username);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <GoogleOAuthProvider clientId="928939603188-ofv91jabatl58dem7upp1tr2sh9kvvce.apps.googleusercontent.com">
      <Router>
        <div className="app">
          <h1>Authentication App</h1>

          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
            } />
            <Route path="/signup" element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Signup />
            } />
            <Route path="/home" element={
              isAuthenticated ? <Home username={username} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />
            } />
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            } />
          </Routes>

          {/* Only show on login/signup pages */}
          <AuthButtons />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;