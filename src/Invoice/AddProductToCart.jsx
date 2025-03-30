import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, FloatingLabel, Form, Modal } from "react-bootstrap";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import { debounce } from "../Utils/utils";
import axios from "axios";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { Field, Formik } from "formik";
import InlineCartData from "./InlineCartData";

const ProductQuantityForm = ({
  productInventory,
  values,
  setFieldValue,
  handleBlur,
}) => {
  console.log("Vaues", values);
  return (
    <>
      {productInventory.map((p) => (
        <Card className="h-25 rounded-pill m-2">
          <Card.Body className="d-flex justify-content-around align-items-center">
            {p.batch_number}
            <div class="vr" />
            {p.expiry_date}
            <div class="vr" />
            <Field
              component={InlineCartData}
              data={p}
              name={p.batch_number + "-quantity"}
              value={values[p.batch_number + "-quantity"]}
              onChange={(b) => setFieldValue(p.batch_number + "-quantity", b)}
              onBlur={handleBlur}
            />
            <div class="vr" />
            <Field
              name={p.batch_number + "-price"}
              type="number"
              onChange={(b) =>
                setFieldValue(p.batch_number + "-price", b.target.value)
              }
              value={values[p.batch_number + "-price"]}
              min={0}
              handleBlur={handleBlur}
              placeholder={p.price}
            />
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

const AddProductToCart = ({ handleClose }) => {
  const [productInventory, setProductInventory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transactionType, setTransactionType] = useState("sales");
  const { token } = useAuth();

  const handleSave = async (requestBody, setFieldValue) => {
    try {
      // setIsLoading(true);
      console.log("requestBody", requestBody);
      const response = (
        await axios.post(
          `${apiURL}/products`,
          requestBody,
          getHeaderOptions(token)
        )
      ).data;
      setFieldValue("product", response);
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
        await axios.get(`${apiURL}/products`, {
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

  const handleGetProductInventory = async (productId) => {
    try {
      // setIsLoading(true);
      const response = (
        await axios.get(`${apiURL}/inventory/product/${productId}`, {
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Product to cart", response);
      setProductInventory(response);
    } catch (error) {
      console.log("error", error);
    }
  };

  const productToCartHeader = Object.freeze([
    {
      name: "Name+net quantity+measure unit",
      batch_number: "Batch Number",
      expiry_date: "Expiry Date",
      quantity: "Quantity",
      price: "Price",
      Amount: "price*quantity",
    },
  ]);
  const createInitialValues = useMemo(() => {
    let initialValues = {};
    productInventory?.forEach((element) => {
      initialValues[element.batch_number + "-quantity"] = 0;
      initialValues[element.batch_number + "-price"] = element.price;
      initialValues[element.batch_number + "-expiry"] = element.expiry_date;
    });
    console.log("InitialValues", initialValues);
    return initialValues;
  }, [productInventory]);

  const handleAddToCart = (formValues) => {
    const commonObject = {};
    //productInventory.
  };

  return (
    <Modal show={true} className="w-100 h-100" onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select product and quantity</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={createInitialValues}
        enableReinitialize={true}
        validate={() => {}}
        onSubmit={(e) => handleAddToCart(e)}
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
                <h4 className="W-50">Product</h4>
                <AsyncSelect
                  name="product"
                  className="w-75"
                  cacheOptions
                  placeholder="Choose product"
                  components={makeAnimated()}
                  getOptionLabel={(e) =>
                    e.name +
                    " | " +
                    e.manufacturer +
                    " | " +
                    e.net_quantity +
                    e.measure_unit +
                    " | " +
                    "Rs. " +
                    e.sp_gst +
                    " | " +
                    e.total_count
                  }
                  getOptionValue={(e) => e.id}
                  loadOptions={handleSearch}
                  value={values.product}
                  onChange={(value) => {
                    setFieldValue("product", value);
                    handleGetProductInventory(value.id);
                  }}
                  autoFocus
                />
              </div>
              {productInventory && (
                <ProductQuantityForm
                  productInventory={productInventory}
                  values={values}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                />
              )}

              <div className="d-flex justify-content-end gap-4 m-4">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!transactionType}>
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
