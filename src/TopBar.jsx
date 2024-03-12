import React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Routes/AuthProvider";

const TopBar = ()=> {
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const handleLogout = () => {
        setToken();
        navigate("/", { replace: true });
    }

    return(
        <div className="top-bar">
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary justify-content-between">
      <Container className="set-max-width">
        <Navbar.Brand className="brand-name" onClick={() => navigate('/', {replace: true})}>Ritik Jaiswal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav fill variant="underline" className="me-auto ms-auto gap-4" defaultActiveKey="link-1">
            <Nav.Link eventKey="link-1" onClick={() => navigate('/service', {replace: true})}>Services</Nav.Link>
            <Nav.Link eventKey="link-1" onClick={() => navigate('/about-us', {replace: true})}>About us</Nav.Link>
            <Nav.Link eventKey="link-1" onClick={() => navigate('/contact-us', {replace: true})}>Contact us</Nav.Link>
          </Nav>
          <Nav>
          <NavDropdown align="end" className="dropdow-menu profile" title="Ritik" id="collapsible-nav-dropdown" flip>
              <NavDropdown.Item onClick={() => navigate('/profile', {replace: true})}>My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        </div>
    )
}

export default TopBar;