import React, { useState } from "react";
import { Button, Carousel, Nav, Image, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import slideImg from "../public/images/1.jpg";
import slideImg2 from "../public/images/2.jpg";
import slideImg3 from "../public/images/3.jpg";
import appLogo from "../public/images/brand_logo.png";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [loginAction, setLoginAction] = useState();
  const navigate = useNavigate();
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" fixed="top">
        <Container>
        <Navbar.Brand href="/" className="brand-main">
            <img src={appLogo} className="brand-img"/>
            <div className="brand-text">
              <div className="brand-title">InWeXpert</div>
              <div className="brand-description">Simplifying Inventory</div>    
            </div>
          </Navbar.Brand>
          <Nav fill variant="underline" className="me-auto ms-auto gap-4">
            <Nav.Link eventKey="link-1" onClick={() => navigate('/service', {replace: true})}>Services</Nav.Link>
            <Nav.Link eventKey="link-1" onClick={() => navigate('/about-us', {replace: true})}>About us</Nav.Link>
            <Nav.Link eventKey="link-1" onClick={() => navigate('/contact-us', {replace: true})}>Contact us</Nav.Link>
          </Nav>
          <div className="d-inline-flex gap-5">
            <Button onClick={() => setLoginAction("login")}>Login</Button>
            <Button onClick={() => setLoginAction("signUp")}>SignUp</Button>
          </div>
        </Container>
      </Navbar>
      <div className="formOnImage p-4 w-100 me-auto ms-auto mt-4">
        {loginAction === "login" && <LoginForm />}
        {loginAction === "signUp" && <SignUpForm />}
      </div>
      <Carousel>
        <Carousel.Item interval={1000}>
          <Image className="d-block w-100" src={slideImg}  alt="First slide" />
        </Carousel.Item>
        <Carousel.Item interval={500}>
          <Image className="d-block w-100" src={slideImg2} alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <Image className="d-block w-100" src={slideImg3} alt="Third slide" />
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default LoginPage;
