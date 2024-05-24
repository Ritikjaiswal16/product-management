import { Formik } from "formik";
import React from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";

export const ProductDetailsForm = ({ showModal, handleClose, handleSave }) => {
  const validateProduct = (values) => {
    let errors = {};
    if (!values.batch_number) {
      errors.batch_number = "Batch number is required";
    }
    if (!values.expiry_date) {
      errors.expiry_date = "Please enter valid date";
    }
    if (!values.cost_price) {
      errors.cost_price = "Cost price should be greater than zero";
    }
    if (!values.stock) {
      errors.product_hsn = "Please enter valid stock value";
    }
    return errors;
  };
  return (
    <Formik
      initialValues={{ product_gst_percentage: 18, product_notify_count: 5 }}
      validate={validateProduct}
      onSubmit={handleSave}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        isValid,
        dirty,
      }) => (
        <>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <FloatingLabel label="Batch number" className="mb-3">
                <Form.Control
                  name="batch_number"
                  type="text"
                  placeholder="put batch number here"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={errors.batch_number && touched.batch_number}
                  value={values.batch_number}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.batch_number}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group>
              <FloatingLabel label="Expiry date" className="mb-3">
                <Form.Control
                  name="expiry_date"
                  type="text"
                  placeholder="put expiry date here"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={errors.expiry_date && touched.expiry_date}
                  value={values.expiry_date}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.expiry_date}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group>
              <FloatingLabel label="Cost price" className="mb-3">
                <Form.Control
                  name="cost_price"
                  type="number"
                  placeholder="put cost price here"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={errors.cost_price && touched.cost_price}
                  value={values.cost_price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cost_price}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <div className="d-flex gap-3">
              <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                <FloatingLabel label="Stock" className="mb-3">
                  <Form.Control
                    name="stock"
                    type="number"
                    placeholder="put stock value here"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.stock && touched.stock}
                    value={values.stock}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};
export default AddProductModal;
