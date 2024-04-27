import { Formik } from "formik";
import React from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";

const AddCustomerModal = ({ showModal, setShowModal, handleSave }) => {
  return (
    <Modal show={true} onHide={() => setShowModal(null)}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Customer</Modal.Title>
      </Modal.Header>
      <AddCustomerForm
        showModal={showModal}
        handleClose={() => setShowModal(null)}
        handleSave={handleSave}
      />
    </Modal>
  );
};

export const AddCustomerForm = ({ showModal, handleClose, handleSave }) => {
  const validate = (values) => {
    let errors = {};
    if (!values.customer_name) {
      errors.customer_name = "Customer Name cannot be empty";
    }
    if (!values.customer_address) {
      errors.customer_address = "Please provide address of customer";
    }
    if (!values.customer_contact_number) {
      errors.customer_contact_number = "Please contact number of customer";
    } else if (values.customer_contact_number.length !== 10) {
      errors.customer_contact_number = "Contact Number should be of 10 digits";
    }
    if (
      values.customer_email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.customer_email)
    ) {
      errors.customer_email = "Email should be of valid format";
    }
    if (
      values.customer_gst &&
      !/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(
        values.customer_gst
      )
    ) {
      errors.customer_gst = "Please provide valid GST number";
    }

    return errors;
  };

  return (
    <Formik
      initialValues={Object.keys(showModal)?.length ? showModal : {}}
      validate={validate}
      onSubmit={handleSave}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        dirty,
      }) => (
        <>
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <FloatingLabel label="Customer Name" className="mb-3">
                  <Form.Control
                    name="customer_name"
                    type="text"
                    placeholder="some customer name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.customer_name && touched.customer_name}
                    value={values.customer_name}
                    autoFocus
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.customer_name}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="Customer Address" className="mb-3">
                  <Form.Control
                    name="customer_address"
                    type="text"
                    placeholder="some customer name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.customer_address && touched.customer_address
                    }
                    value={values.customer_address}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.customer_address}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="Contact Number" className="mb-3">
                  <Form.Control
                    name="customer_contact_number"
                    type="text"
                    placeholder="45HSNU56"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.customer_contact_number &&
                      touched.customer_contact_number
                    }
                    value={values.customer_contact_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.customer_contact_number}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="GST Number" className="mb-3">
                  <Form.Control
                    name="customer_gst"
                    type="text"
                    placeholder="45HSNU56"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.customer_gst && touched.customer_gst}
                    value={values.customer_gst}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="Customer Email" className="mb-3">
                  <Form.Control
                    name="customer_email"
                    type="text"
                    placeholder="abc@mail.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.customer_email && touched.customer_email}
                    value={values.customer_email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.customer_email}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!isValid || !dirty}
              >
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default AddCustomerModal;
