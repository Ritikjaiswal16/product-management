import React from "react";
import axios from 'axios';
import { Form, Card, Col, Row, Button } from "react-bootstrap";
import { useAuth } from "./Routes/AuthProvider";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { setToken } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async(e)=>{
        e.preventDefault();
        try{
        const requestBody = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        const options = {
          headers: {
            'Content-Type': "application/json;charset=UTF-8",
            'access-control-allow-origin': "*",
            'access-control-allow-methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
          },
          // withCredentials: true
        }
        const response = (await axios.post('http://192.168.1.13:8000/api/account/login', requestBody, options)).data;
        console.log("Response", response);
        console.log("Login Successful with credentials: ", requestBody);
        setToken(response.token.access);
        navigate("/", { replace: true });
      }catch(error){
        console.log("error", error);
      }
    }
    return(
        <Card className="p-4 w-50 me-auto ms-auto mt-4">
            <Card.Body>
        <Card.Title className="mb-4">Good to see you back!</Card.Title>
        <Form onSubmit={handleLogin}>

        <Form.Group as={Row} className="mb-3" controlId="email">
          <Form.Label column sm="2">
            Email
          </Form.Label>
          <Col sm="10">
            <Form.Control type="email" placeholder="name@example.com" autoFocus required/>  
          </Col>
        </Form.Group>
  
        <Form.Group as={Row} className="mb-3" controlId="password" >
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Col sm="10">
            <Form.Control type="password" placeholder="Password" required/>
          </Col>
        </Form.Group>

        <Button className="w-100" type="submit" >Go <i className="bi bi-arrow-right ms-2"></i></Button>
        
      </Form>
      </Card.Body>
      </Card>
    )
}

export default LoginForm;