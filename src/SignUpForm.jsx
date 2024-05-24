import React, { useState } from "react";
import axios from "axios";
import { Form, Card, Col, Row, Button } from "react-bootstrap";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Routes/AuthProvider";
import { apiURL } from "./Utils/AxiosUtils";

const SignUpForm = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (values) => {
    try {
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("gst_number", values.gstNumber);
      formData.append("address", values.address);
      formData.append("contact_number", values.contactNumber);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("signature_image", values.signature);
      const options = {
        headers: {
          "Content-Type": "multipart/form-data;",
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      };
      const response = (
        await axios.post(`${apiURL}/api/account/register`, formData, options)
      ).data;
      console.log("Account created successfully: ", formData);
      setToken(response.token.access);
      navigate("/", { replace: true });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Card className="p-4 w-75 me-auto ms-auto mt-4">
      <Card.Body>
        <Card.Title className="mb-4">Hey there! Welcome</Card.Title>
        <Formik
          initialValues={{
            name: "",
            email: "",
            gstNumber: "",
            address: "",
            contactNumber: "",
            signature: "",
            password: "",
            confirmPassword: "",
          }}
          validate={({
            name,
            email,
            gstNumber,
            address,
            contactNumber,
            signature,
            password,
            confirmPassword,
          }) => {
            const errors = {};
            if (!name?.trim()) {
              errors.name = "Required";
            }
            if (!gstNumber?.trim()) {
              errors.gstNumber = "Required";
            } else if (
              !/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(
                gstNumber
              )
            ) {
              errors.gstNumber = "Invalid GST number";
            }
            if (!address?.trim()) {
              errors.address = "Required";
            }
            if (!contactNumber?.trim()) {
              errors.contactNumber = "Required";
            } else if (
              !/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(contactNumber)
            ) {
              errors.contactNumber = "Invalid contact number";
            }
            if (!signature) {
              errors.signature = "Required";
            }
            if (!password?.trim()) {
              errors.password = "Required";
            } else if (
              !/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!#$%&?"]).{8,}$/.test(password)
            ) {
              errors.password =
                'Password should be of minimum length 8 and contain at least two alphabets (lower and upper case) and two symbols(!#$%&?"). Should not contain space';
            }
            if (!confirmPassword?.trim()) {
              errors.confirmPassword = "Required";
            } else if (password !== confirmPassword) {
              errors.confirmPassword = "should match with password";
            }
            if (!email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={handleSignUp}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isValid,
            dirty,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Company Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="name"
                    value={values.name}
                    type="text"
                    placeholder="John Agro"
                    autoFocus
                    isInvalid={errors.name && touched.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  GST No.
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="gstNumber"
                    value={values.gstNumber}
                    type="text"
                    placeholder="GSTIN123456"
                    isInvalid={errors.gstNumber && touched.gstNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.gstNumber}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Address
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="address"
                    value={values.address}
                    as="textarea"
                    rows={3}
                    placeholder="221B - Baker Street, London"
                    isInvalid={errors.address && touched.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Contact No.
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="contactNumber"
                    value={values.contactNumber}
                    type="text"
                    placeholder="+91 1234567890"
                    isInvalid={errors.contactNumber && touched.contactNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contactNumber}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="email"
                    value={values.email}
                    type="email"
                    placeholder="name@example.com"
                    isInvalid={errors.email && touched.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Signature
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={(event) => {
                      setFieldValue("signature", event.target.files[0]);
                    }}
                    onBlur={handleBlur}
                    name="signature"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    isInvalid={errors.signature && touched.signature}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.signature}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Password
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="password"
                    value={values.password}
                    type="password"
                    placeholder="Password"
                    isInvalid={errors.password && touched.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Confirm Password
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.confirmPassword && touched.confirmPassword
                    }
                    value={values.confirmPassword}
                    name="confirmPassword"
                    type="password"
                    placeholder="Password"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Button
                className="w-100"
                type="submit"
                disabled={!isValid || !dirty}
              >
                <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default SignUpForm;
