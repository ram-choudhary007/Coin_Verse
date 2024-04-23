import React, { useState } from 'react';
import './CSS//Login.css';
import profile from './assets/profile.png'
import LoginPopup from './LoginPopup';
import { useSelector } from 'react-redux';
import ProfilePopup from './ProfilePopup';

const Login = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const user = useSelector((state) => state.auth?.userDetails) || null;
  const handleLogin = () => {
    setIsLogin(true);
    setIsPopupOpen(true);
  };

  const handleSignup = () => {
    setIsLogin(false);
    setIsPopupOpen(true);
  }

  return (
    <>{user ?
      (<>
        <button className='profile_btn'>
          <img className='profile_photo' src={profile} alt="Profile" />
        <div className='profile_popup'><ProfilePopup /></div>  
        </button>
      </>)
      :
      (<>
        <div className='loginSignPage'>
          <div className="login">
            <button onClick={handleLogin}>Log In</button>
          </div>
          <div className="signup">
            <button onClick={handleSignup}>Sign Up</button>
          </div>
        </div>
      </>)}

      {isPopupOpen && <LoginPopup setIsPopupOpen={setIsPopupOpen} isLogin={isLogin} />}
    </>
  );
};

export default Login;
