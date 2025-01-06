// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import '.././css/main.css'; // Ensure this import is here

const HeaderYS = ({ isAuthenticated, onLoginButtonClick, username, onLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">
        <img
          alt="Logo TSMART"
          src="/YSLogo_2024.png"
          width="50"
          height="50"
          className="d-inline-block align-center"
        />{' '}
        Testing SUMO Cesium Integration - Cesium Ecosystem Grant{' '}
        {/* <small><sub>&copy; 2024 Yazan Safadi, All rights reserved.</sub></small> */}
      </Navbar.Brand>
    </Navbar>
  );
};

export default HeaderYS;