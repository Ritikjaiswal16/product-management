import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, FloatingLabel, Form, Modal } from "react-bootstrap";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import { debounce } from "../Utils/utils";
import axios from "axios";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { AddCustomerForm } from "../Customers/AddCustomerModal";
import { useNavigate } from "react-router-dom";
import { AddProductForm } from "../Product/AddProductModal";
import { Formik } from "formik";

const AddProductToCart = ({ handleClose }) => {
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [transactionType, setTransactionType] = useState("sales");
  const { token } = useAuth();

  const validateProduct = (values) => {
    let errors = {};
    if (!values.product) {
      errors.product = "Please select any product";
    }
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

  const handleSave = async (requestBody, setFieldValue) => {
    try {
      // setIsLoading(true);
      console.log("requestBody", requestBody);
      const response = (
        await axios.post(
          `${apiURL}/api/products`,
          requestBody,
          getHeaderOptions(token)
        )
      ).data;
      setFieldValue("product", response);
      setAddNewProduct(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleProceed = (values) => {
    console.log("values", values);
    handleClose();
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleSearch = useCallback(
    debounce((value, callback) => getProducts(value, callback)),
    []
  );

  const getProducts = async (value, callback) => {
    try {
      // setIsLoading(true);
      const response = (
        await axios.get(`${apiURL}/api/products`, {
          params: { page: 1, search: value },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      callback(response.results);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Modal show={true} className="w-100 h-100" onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select product and quantity</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{}}
        validate={validateProduct}
        onSubmit={handleProceed}
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
              <div className="d-flex gap-4 m-4">
                <h4 className="W-50">Customer</h4>
                <AsyncSelect
                  name="product"
                  className="w-75"
                  cacheOptions
                  placeholder="Choose product"
                  components={makeAnimated()}
                  getOptionLabel={(e) =>
                    e.product_name +
                    " | " +
                    e.product_manufacturer +
                    " | " +
                    e.product_net_quantity +
                    e.product_measure_unit +
                    " | " +
                    "Rs. " +
                    e.product_sp_gst +
                    " | " +
                    e.product_total_count
                  }
                  getOptionValue={(e) => e.id}
                  loadOptions={handleSearch}
                  value={values.product}
                  onChange={(value) => {
                    setAddNewProduct(false);
                    setFieldValue("product", value);
                  }}
                  onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.product}
                </Form.Control.Feedback>
                <Button
                  className="d-flex justify-content-center"
                  onClick={() => setAddNewProduct(!addNewProduct)}
                >
                  <div>New Product</div>
                  <box-icon
                    type="solid"
                    color="white"
                    name={addNewProduct ? "chevron-up" : "chevron-down"}
                  ></box-icon>
                </Button>
              </div>
              {addNewProduct && (
                <Card className="m-2">
                  <AddProductForm
                    showModal={{}}
                    handleClose={() => setAddNewProduct(false)}
                    handleSave={(values) => handleSave(values, setFieldValue)}
                  />
                </Card>
              )}

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

              <div className="d-flex justify-content-end gap-4 m-4">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  // onClick={handleProceed}
                  type="submit"
                  disabled={!transactionType || !isValid || !dirty}
                >
                  Add to cart
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default AddProductToCart;
