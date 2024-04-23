import React from 'react';
import './CSS/ProfilePopup.css';
import profile from './assets/profile.png';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { auth } from './config/firebase';
import { signOut } from 'firebase/auth';

const handleLogout = () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out successfully");
        })
        .catch((error) => {
            console.error('Error signing out:', error.message);
        });
};

const ProfilePopup = () => {
    const user = useSelector((state) => state.auth?.userDetails) || null;
    const name = user.displayName || "Guest" ;
    return (
        <div className='prof_Pop'>
            <div className="prof_box">
                <div className='profile_details'>
                    <div style={{ display: "flex", margin: "5px" }}>
                        <div>
                            <img className='profile_photo' src={profile} alt="Profile" />
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                            <p>Hi, {name}</p>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <ul>
                    <li><Link to='/favourite'>Watchlist</Link></li>
                    <li><Link to='/wallet'>Portfolio</Link></li>
                    <li><Link to='/about'>About us</Link></li>
                    <li><button className='logOut_btn' onClick={handleLogout}>Log out</button></li>
                </ul>
            </div>
        </div>
    );
};

export default ProfilePopup;
