import React from 'react';
import './CSS//Header.css';
import Logo from '../Components/assets/logo.png';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink
import Search from './Search';
import Login from './Login';

export default function Header() {
  return (
    <div className="header">
      <ul>
        <li className='logo_name'>
          <Link to="/">
            <div className='logo_container'>
              <div><img className='logo' src={Logo} alt="Logo" /></div>
              <div><h2>Crypto Verse</h2></div>
            </div>
          </Link>
        </li>
        <li>
          <NavLink to="/favourite" activeClassName="active">Favourite</NavLink> {/* Use NavLink */}
        </li>
        <li><NavLink to="/orders" activeClassName="active">Orders</NavLink></li>
        <li><NavLink to="/wallet" activeClassName="active">Wallet</NavLink></li>
        <li>
          <Search />
        </li>
        <li>
          <Login />
        </li>
      </ul>
      <hr />
    </div>
  );
}
