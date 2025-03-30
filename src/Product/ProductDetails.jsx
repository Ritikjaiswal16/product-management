import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import SpinnerOverlay from "../Components/SpinnerOverlay";
import axios from "axios";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import CustomTable from "../Table/CustomTable";
import { debounce } from "../Utils/utils";
import moment from "moment";
import "./ProductDetails.css";
import "../DetailsView.css";
import { Formik } from "formik";
import DetailsAccordions from "../Components/DetailsAccordions";
import "boxicons";

const ProductDetails = () => {
  const { productId } = useParams();
  const { token } = useAuth();
  const [productData, setProductData] = useState({});
  const [productDetail, setProductDetail] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState();
  const [isTableLoading, setIsTableLoading] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const setPagination = (number = 1) => {
    getProductHistory(number);
    setPageNumber(number);
  };

  const validateProduct = (values) => {
    let errors = {};
    if (!values.sp_credit) {
      errors.sp_credit = "Please provide credit price";
    }
    if (!values.gst_percentage) {
      errors.gst_percentage = "Please provide GST number";
    }
    if (!values.sp_gst) {
      errors.sp_gst =
        "Please provide estimated selling price including GST";
    }
    if (!values.notify_count) {
      errors.notify_count =
        "Please provide notify count to remind when reach that value";
    }
    return errors;
  };

  const getProduct = async () => {
    try {
      setIsLoading(true);
      const response = (
        await axios.get(
          `${apiURL}/products/${productId}`,
          getHeaderOptions(token)
        )
      ).data;
      setProductData(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const productHistoryHeader = Object.freeze([
    {
      name: "Purchased From",
      accessorKey: "customer_name",
    },
    {
      name: "Cost Price",
      accessorKey: "price",
    },
    {
      name: "Quantity",
      accessorKey: "quantity",
      onClick: (value) => {
        if(value.invoice_type=="Sales Return" || value.invoice_type=="Purchase") 
          return ( <span style={{color:"green"}}>+ {value.quantity} </span>)
        else
          return ( <span style={{color:"red"}}>-  &nbsp;{value.quantity} </span>)
      },
    },
    {
      name: "Type",                                                                       
      accessorKey: "invoice_type",
    },
    {
      name: "Batch Number",
      accessorKey: "batch_number",
    },
    {
      name: "Expiry Date",
      accessorKey: "expiry_date",
      onClick: (value) => {
        let testDateUtc = moment.utc(value.expiry_date).local();
        return testDateUtc.format("DD/MM/YYYY");
      },
    },
    {
      name: "Transaction Date",
      accessorKey: "date",
      onClick: (value) => {
        let testDateUtc = moment.utc(value.date).local();
        return testDateUtc.format("DD/MM/YYYY, hh:mm A");
      },
    },
  ]);

  const handleSave = async (requestBody) => {
    const body = {
      ...requestBody,
      notify_count: requestBody.notify_count,
      gst_percentage: requestBody.gst_percentage,
      sp_gst: requestBody.sp_gst,
      sp_credit: requestBody.sp_credit,
    };
    try {
      setIsLoading(true);
      console.log("requestBody", requestBody);
      const response = (
        await axios.put(
          `${apiURL}/products/${requestBody.id}`,
          body,
          getHeaderOptions(token)
        )
      ).data;
      // setToastInfo({type:"success", message:"Product Added successfully."});
      console.log("Response", response);
      setProductData((prev) => ({ ...prev, ...response }));
      setIsEditing(false);
    } catch (error) {
      console.log("error", error);
      // setToastInfo({type:"error", message:"Something went wrong."});
    } finally {
      setIsLoading(false);
    }
  };

  const getProductHistory = useCallback(async (pageNumber, searchText) => {
    try {
      setIsTableLoading(true);
      const response = (
        await axios.get(`${apiURL}/invenotrylogs/product/${productId}`, {
          params: { page: pageNumber || 1, search: searchText },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      setProductDetail(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsTableLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    debounce((value) => getProductHistory(1, value)),
    []
  );

  useEffect(() => {
    getProduct();
    getProductHistory();
  }, []);

  return (
    <div className="top-div">
      {isLoading && <SpinnerOverlay />}
      {Object.keys(productData)?.length ? (
        <div>
          <Formik
            initialValues={productData}
            validate={validateProduct}
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
                  <DetailsAccordions
                    backButton={
                      <div
                        className="details-back-btn"
                        onClick={() => navigate("/products")}
                      >
                        <box-icon size="md" name="chevron-left"></box-icon>
                      </div>
                    }
                    title={
                      <Form.Group className="d-flex align-center gap-1">
                        <h4 className="pt-1">{productData.name}</h4>
                      </Form.Group>
                    }
                    rightButton={
                      <div className="d-flex gap-4">
                        {isEditing ? (
                          <>
                            <Button
                              className="product-edit rounded-3"
                              onClick={() => handleSubmit()}
                              disabled={!isValid || !dirty}
                            >
                              Save
                            </Button>
                            <Button
                              className="product-edit rounded-3"
                              variant="secondary"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              className="product-edit rounded- details-button"
                              onClick={() => setIsEditing(true)}
                            >
                              Edit
                            </Button>
                          </>
                        )}
                      </div>
                    }
                    body={
                      <div class="table-responsive-sm">
                        <table class="table table-borderless">
                          <tbody>
                            <tr>
                              <td class="fw-bolder pb-0">Manufacturer</td>
                              <td class="fw-bolder pb-0">HSN Code</td>
                              <td class="fw-bolder pb-0"> Net Quantity</td>
                              <td class="fw-bolder pb-0">Available Unit</td>
                            </tr>
                            <tr>
                              <td class="pt-0">
                                {" "}
                                {productData.manufacturer}
                              </td>
                              <td class="pt-0">{productData.hsn}</td>
                              <td class="pt-0">
                                {productData.net_quantity +
                                  " " +
                                  productData.measure_unit}
                              </td>
                              <td class="pt-0">
                                {productData.total_count}
                              </td>
                            </tr>
                            <tr>
                              <td class="fw-bolder pb-0 pt-3">Selling Price</td>
                              <td class="fw-bolder pb-0 pt-3">Credit price</td>
                              <td class="fw-bolder pb-0 pt-3">GST %</td>
                              <td class="fw-bolder pb-0 pt-3">Notify Count</td>
                            </tr>
                            <tr>
                              <td class="py-0">
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      className="border-0 shadow-none product-value"
                                      name="sp_gst"
                                      type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.sp_gst &&
                                        touched.sp_gst
                                      }
                                      value={values.sp_gst}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.sp_gst}
                                    </Form.Control.Feedback>
                                  </>
                                ) : (
                                  <a>{productData.sp_gst}</a>
                                )}
                              </td>
                              <td class="py-0">
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      className="border-0 shadow-none product-value"
                                      name="sp_credit"
                                      type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.sp_credit &&
                                        touched.sp_credit
                                      }
                                      value={values.sp_credit}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.sp_credit}
                                    </Form.Control.Feedback>
                                  </>
                                ) : (
                                  <a>{productData.sp_credit}</a>
                                )}
                              </td>
                              <td class="py-0">
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      className="border-0 shadow-none product-value"
                                      name="gst_percentage"
                                      type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.gst_percentage &&
                                        touched.gst_percentage
                                      }
                                      value={values.gst_percentage}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.gst_percentage}
                                    </Form.Control.Feedback>
                                  </>
                                ) : (
                                  <a>{productData.gst_percentage}</a>
                                )}
                              </td>
                              <td class="py-0">
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      className="border-0 shadow-none product-value"
                                      name="notify_count"
                                      type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.notify_count &&
                                        touched.notify_count
                                      }
                                      value={values.notify_count}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.notify_count}
                                    </Form.Control.Feedback>
                                  </>
                                ) : (
                                  <a>{productData.notify_count}</a>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    }
                  ></DetailsAccordions>
                </Form>
              </>
            )}
          </Formik>
        </div>
      ) : null}
      <CustomTable
        className={"history-table"}
        isLoading={isTableLoading}
        title={"Product History"}
        headers={productHistoryHeader}
        records={productDetail?.results}
        totalRecords={productDetail?.count}
        pageNumber={pageNumber}
        setPageNumber={setPagination}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default ProductDetails;
