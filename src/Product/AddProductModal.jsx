import { Formik } from "formik";
import React from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";

const AddProductModal = ({ showModal, setShowModal, handleSave }) => {
  return (
    <Modal show={true} onHide={() => setShowModal(null)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <AddProductForm
        showModal={showModal}
        handleClose={() => setShowModal(null)}
        handleSave={handleSave}
      />
    </Modal>
  );
};

export const AddProductForm = ({ showModal, handleClose, handleSave }) => {
  console.log("cscjafawfwa", 1233333333333);
  const validateProduct = (values) => {
    let errors = {};
    if (!values.product_name) {
      errors.product_name = "Product Name cannot be empty";
    }
    if (!values.product_net_quantity) {
      errors.product_net_quantity = "Please provide net quantity of product";
    }
    if (!values.product_manufacturer) {
      errors.product_manufacturer = "Please provide Manufacturer of product";
    }
    if (!values.product_hsn) {
      errors.product_hsn = "Please provide HSN code written on product";
    }
    if (!values.product_measure_unit) {
      errors.product_measure_unit =
        "Please select one measuring unit of product";
    }
    if (!values.product_sp_credit) {
      errors.product_sp_credit = "Please provide credit price";
    }
    if (!values.product_gst_percentage) {
      errors.product_gst_percentage = "Please provide GST number";
    }
    if (!values.product_sp_gst) {
      errors.product_sp_gst =
        "Please provide estimated selling price including GST";
    }
    if (!values.product_notify_count) {
      errors.product_notify_count =
        "Please provide notify count to remind when reach that value";
    }
    return errors;
  };
  return (
    <Formik
      initialValues={
        Object.keys(showModal)?.length
          ? showModal
          : { product_gst_percentage: 18, product_notify_count: 5 }
      }
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
          <Form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Modal.Body>
              <Form.Group>
                <FloatingLabel label="Product Name" className="mb-3">
                  <Form.Control
                    name="product_name"
                    type="text"
                    placeholder="some product name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.product_name && touched.product_name}
                    value={values.product_name}
                    autoFocus
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.product_name}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel
                  label="Product Manufacturer Name"
                  className="mb-3"
                >
                  <Form.Control
                    name="product_manufacturer"
                    type="text"
                    placeholder="some product name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.product_manufacturer &&
                      touched.product_manufacturer
                    }
                    value={values.product_manufacturer}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.product_manufacturer}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="HSN/SAC Code" className="mb-3">
                  <Form.Control
                    name="product_hsn"
                    type="text"
                    placeholder="45HSNU56"
                    onChange={(e) =>
                      setFieldValue(
                        "product_hsn",
                        e.target.value?.toUpperCase()
                      )
                    }
                    onBlur={handleBlur}
                    isInvalid={errors.product_hsn && touched.product_hsn}
                    value={values.product_hsn}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.product_hsn}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <div className="d-flex gap-3">
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel label="Net Quantity" className="mb-3">
                    <Form.Control
                      name="product_net_quantity"
                      type="number"
                      placeholder="12"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.product_net_quantity &&
                        touched.product_net_quantity
                      }
                      value={values.product_net_quantity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.product_net_quantity}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <Form.Select
                    style={{ padding: "15px" }}
                    name="product_measure_unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.product_measure_unit}
                    isInvalid={
                      errors.product_measure_unit &&
                      touched.product_measure_unit
                    }
                  >
                    <option className="d-none" selected disabled>
                      Measure Unit
                    </option>
                    <option value="ml">Milli Liter (ml)</option>
                    <option value="l">Liter (l)</option>
                    <option value="gm">Gram (gm)</option>
                    <option value="kg">Kilogram (kg)</option>`
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.product_measure_unit}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="d-flex gap-3">
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel
                    label="Selling Price (in Rupees)"
                    className="mb-3"
                  >
                    <Form.Control
                      name="product_sp_gst"
                      type="number"
                      placeholder="90"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.product_sp_gst && touched.product_sp_gst
                      }
                      value={values.product_sp_gst}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.product_sp_gst}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel
                    label="Credit Price (in Rupees)"
                    className="mb-3"
                  >
                    <Form.Control
                      name="product_sp_credit"
                      type="number"
                      placeholder="90"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.product_sp_credit && touched.product_sp_credit
                      }
                      value={values.product_sp_credit}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.product_sp_credit}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </div>
              <div className="d-flex gap-3">
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel label="Total GST (in %)" className="mb-3">
                    <Form.Control
                      name="product_gst_percentage"
                      type="number"
                      placeholder="9"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.product_gst_percentage &&
                        touched.product_gst_percentage
                      }
                      value={values.product_gst_percentage}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.product_gst_percentage}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel label="Notify Count" className="mb-3">
                    <Form.Control
                      name="product_notify_count"
                      type="number"
                      placeholder="90"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.product_notify_count &&
                        touched.product_notify_count
                      }
                      value={values.product_notify_count}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.product_notify_count}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </div>
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
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </>
      )}
    </Formik>
  );
};
export default AddProductModal;
