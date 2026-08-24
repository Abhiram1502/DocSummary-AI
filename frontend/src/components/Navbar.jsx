import React from 'react';
import logo from '../assets/logo.png'
const Navbar = () => {
  return (
    <header style={{
      backgroundColor: 'var(--navbar)',
      borderBottom: '1px solid var(--border)',
      height: '100px',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justify: 'flex-start',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src={logo} 
          alt="DocSummary AI" 
          style={{
            objectFit: 'contain',
            objectPosition: 'left center'
          }}
          className="navbar-logo-img"
        />
      </div>

      <style>{`
        .navbar-logo-img {
          width: 300px;
          height: 90px;
        }

        @media (max-width: 768px) {
          .navbar-logo-img {
            width: 180px;
            height: 55px;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
