import React from 'react'
import './CSS//Header.css';
import Logo from '../Components/assets/logo.png';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ display: "flex",  justifyContent: "space-around"}}>
        <div>
          <Link to="/">
            <div className='logo_container'>
              <div><img className='logo' src={Logo} alt="Logo" /></div>
              <div><h2 className='cryptoVerse'>Crypto Verse</h2></div>
            </div>
          </Link>
        </div>
        <div >
          <h4>Products</h4>
          <ul style={{display: "block"}}>
            <li>Crypto API</li>
            <li>Advertise</li>
            <li>CMC Labs</li>
            <li>ChatGPT Plugin</li>
            <li>Sitemap</li>
          </ul>
        </div>
        <div >
          <h4>Company</h4>
          <ul style={{display: "block"}}>
            <li>About us</li>
            <li>Terms of use</li>
            <li>Privacy Policy</li>
            <li>Cookie preferences</li>
            <li>Disclaimer</li>
          </ul>
        </div>
        <div >
          <h4>Socials</h4>
          <ul style={{display: "block"}}>
            <li> <Link to='https://www.linkedin.com/in/ram-choudhary214/' target="_blank"  style={{color: "#6e7583"}}>LinkedIn</Link></li>
            <li>X (Twitter)</li>
            <li>Community</li>
            <li>Telegram</li>
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Reddit</li>
          </ul>
        </div>
      </div>
      <br />
      <p>© 2024 CryptoVerse. All rights reserved</p>
    </footer>
  )
}