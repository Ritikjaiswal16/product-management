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
    if (!values.name) {
      errors.name = "Customer Name cannot be empty";
    }
    if (!values.address) {
      errors.address = "Please provide address of customer";
    }
    if (!values.contact_number) {
      errors.contact_number = "Please contact number of customer";
    } else if (values.contact_number.length !== 10) {
      errors.contact_number = "Contact Number should be of 10 digits";
    }
    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = "Email should be of valid format";
    }
    if (
      values.gst &&
      !/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(values.gst)
    ) {
      errors.gst = "Please provide valid GST number";
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
                    name="name"
                    type="text"
                    placeholder="some customer name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.name && touched.name}
                    value={values.name}
                    autoFocus
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="Customer Address" className="mb-3">
                  <Form.Control
                    name="address"
                    type="text"
                    placeholder="some customer name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.address && touched.address}
                    value={values.address}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="Contact Number" className="mb-3">
                  <Form.Control
                    name="contact_number"
                    type="text"
                    placeholder="45HSNU56"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.contact_number && touched.contact_number}
                    value={values.contact_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contact_number}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="GST Number" className="mb-3">
                  <Form.Control
                    name="gst"
                    type="text"
                    placeholder="45HSNU56"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.gst && touched.gst}
                    value={values.gst}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="Customer Email" className="mb-3">
                  <Form.Control
                    name="email"
                    type="text"
                    placeholder="abc@mail.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.email && touched.email}
                    value={values.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
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
