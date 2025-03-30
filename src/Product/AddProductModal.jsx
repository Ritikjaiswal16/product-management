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
  const validateProduct = (values) => {
    let errors = {};
    if (!values.name) {
      errors.name = "Product Name cannot be empty";
    }
    if (!values.net_quantity) {
      errors.net_quantity = "Please provide net quantity of product";
    }
    if (!values.manufacturer) {
      errors.manufacturer = "Please provide Manufacturer of product";
    }
    if (!values.hsn) {
      errors.hsn = "Please provide HSN code written on product";
    }
    if (!values.measure_unit) {
      errors.measure_unit = "Please select one measuring unit of product";
    }
    if (!values.sp_credit) {
      errors.sp_credit = "Please provide credit price";
    }
    if (!values.gst_percentage) {
      errors.gst_percentage = "Please provide GST number";
    }
    if (!values.sp_gst) {
      errors.sp_gst = "Please provide estimated selling price including GST";
    }
    if (!values.notify_count) {
      errors.notify_count =
        "Please provide notify count to remind when reach that value";
    }
    return errors;
  };
  return (
    <Formik
      initialValues={
        Object.keys(showModal)?.length
          ? showModal
          : { gst_percentage: 18, notify_count: 5 }
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
                    name="name"
                    type="text"
                    placeholder="some product name"
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
                <FloatingLabel
                  label="Product Manufacturer Name"
                  className="mb-3"
                >
                  <Form.Control
                    name="manufacturer"
                    type="text"
                    placeholder="some product name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.manufacturer && touched.manufacturer}
                    value={values.manufacturer}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.manufacturer}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <FloatingLabel label="HSN/SAC Code" className="mb-3">
                  <Form.Control
                    name="hsn"
                    type="text"
                    placeholder="45HSNU56"
                    onChange={(e) =>
                      setFieldValue("hsn", e.target.value?.toUpperCase())
                    }
                    onBlur={handleBlur}
                    isInvalid={errors.hsn && touched.hsn}
                    value={values.hsn}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hsn}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <div className="d-flex gap-3">
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel label="Net Quantity" className="mb-3">
                    <Form.Control
                      name="net_quantity"
                      type="number"
                      placeholder="12"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.net_quantity && touched.net_quantity}
                      value={values.net_quantity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.net_quantity}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <Form.Select
                    style={{ padding: "15px" }}
                    name="measure_unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.measure_unit}
                    isInvalid={errors.measure_unit && touched.measure_unit}
                  >
                    <option className="d-none" selected disabled>
                      Measure Unit
                    </option>
                    <option value="ML">Milli Liter (ml)</option>
                    <option value="LIT">Liter (l)</option>
                    <option value="GM">Gram (gm)</option>
                    <option value="KG">Kilogram (kg)</option>
                    <option value="MG">Milligram (mg)</option>
                    <option value="FOOT">Foot (ft)</option>
                    <option value="INCH">Inch (inch)</option>
                    <option value="PIECE">Piece (pic)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.measure_unit}
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
                      name="sp_gst"
                      type="number"
                      placeholder="90"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.sp_gst && touched.sp_gst}
                      value={values.sp_gst}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sp_gst}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel
                    label="Credit Price (in Rupees)"
                    className="mb-3"
                  >
                    <Form.Control
                      name="sp_credit"
                      type="number"
                      placeholder="90"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.sp_credit && touched.sp_credit}
                      value={values.sp_credit}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sp_credit}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </div>
              <div className="d-flex gap-3">
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel label="Total GST (in %)" className="mb-3">
                    <Form.Control
                      name="gst_percentage"
                      type="number"
                      placeholder="9"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.gst_percentage && touched.gst_percentage
                      }
                      value={values.gst_percentage}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.gst_percentage}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                  <FloatingLabel label="Notify Count" className="mb-3">
                    <Form.Control
                      name="notify_count"
                      type="number"
                      placeholder="90"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.notify_count && touched.notify_count}
                      value={values.notify_count}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.notify_count}
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
