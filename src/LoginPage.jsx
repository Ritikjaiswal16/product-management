import React, { useState } from "react";
import { Button, Carousel, Image, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [loginAction, setLoginAction] = useState();
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Company Name</Navbar.Brand>
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
          <Image className="d-block w-100" src="1.jpg" alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item interval={500}>
          <Image className="d-block w-100" src="2.jpg" alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <Image className="d-block w-100" src="3.jpg" alt="Second slide" />
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default LoginPage;
