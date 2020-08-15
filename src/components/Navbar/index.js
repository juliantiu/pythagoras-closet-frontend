import React from 'react';
import { Navbar as BNavbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { useAuthState } from '../../context_hooks/AuthState';
import '../../assets/css/style.css';

export default function Navbar() {
  const { logout } = useAuthState();

  return (
    <BNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <BNavbar.Brand className="font-1 font-size-8">Pythagora's Closet</BNavbar.Brand>
      <BNavbar.Toggle aria-controls="responsive-navbar-nav" />
      <BNavbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className="font-1 font-size-6" href="/">Home</Nav.Link>
          <Nav.Link className="font-1 font-size-6" href="/">Laundry</Nav.Link>
          <Nav.Link className="font-1 font-size-6" href="/">Washer</Nav.Link>
        </Nav>
        <Button variant="dark" className="ml-auto" alt="logout button" onClick={logout}><FontAwesomeIcon icon={faPowerOff} size="lg"/></Button>
      </BNavbar.Collapse>
    </BNavbar>
  );
}
