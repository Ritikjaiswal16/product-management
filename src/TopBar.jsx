import React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Routes/AuthProvider";
import appLogo from "../public/images/brand_logo.png";

const TopBar = ()=> {
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const handleLogout = () => {
        setToken();
        navigate("/", { replace: true });
    }

    return(
        <div className="top-bar">
        <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary justify-content-between">
      <Container className="set-max-width">
        <Navbar.Brand className="brand-name" onClick={() => navigate('/', {replace: true})}>            <img src={appLogo} className="brand-img"/>
            <div className="brand-text">
              <div className="brand-title">Patel Agro</div>
              <div className="brand-description" style={{color:"white"}}>Powerd by InWeXpert</div>    
            </div>
        </Navbar.Brand>
   
          <NavDropdown align="end" className="dropdow-menu profile" title="Settings" id="collapsible-nav-dropdown" flip>
              <NavDropdown.Item onClick={() => navigate('/profile', {replace: true})}>My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
     
      </Container>
    </Navbar>
        </div>
    )
}

export default TopBar;