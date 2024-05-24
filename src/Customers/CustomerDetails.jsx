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
import "./CustomerDetails.css";
import "../DetailsView.css";
import { Formik } from "formik";
import AddCustomerHistoryModal from "./AddCustomerHistoryModal";
import DetailsAccordions from "../Components/DetailsAccordions";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const { token } = useAuth();
  const [customerData, setCustomerData] = useState({});
  const [customerDetail, setCustomerDetail] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState();
  const [isTableLoading, setIsTableLoading] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const navigate = useNavigate();

  const setPagination = (number = 1) => {
    getCustomerHistory(number);
    setPageNumber(number);
  };

  const validateCustomer = (values) => {
    console.log(values);
    let errors = {};
    if (!values.customer_name) {
      errors.customer_name = "Please provide customer name";
    }
    if (!values.customer_address) {
      errors.customer_address = "Please provide address of the customer";
    }
    if (!values.customer_contact_number) {
      errors.customer_contact_number = "Please provide contact number";
    } else if (!/[0-9]{10}/.test(values.customer_contact_number)) {
      errors.customer_contact_number = "Please provide valid contact number";
    }
    if (
      values.customer_email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.customer_email)
    ) {
      errors.customer_email = "Please provide valid email address";
    }
    return errors;
  };

  const getCustomer = async () => {
    try {
      setIsLoading(true);
      const response = (
        await axios.get(
          `${apiURL}/api/customers/${customerId}`,
          getHeaderOptions(token)
        )
      ).data;
      setCustomerData(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const customerHistoryHeader = Object.freeze([
    {
      name: "Date",
      accessorKey: "date",
      onClick: (value) => {
        let testDateUtc = moment.utc(value.date).local();
        return testDateUtc.format("DD/MM/YYYY, hh:mm A");
      },
    },
    {
      name: "Payment Type",
      accessorKey: "payment_type",
    },
    {
      name: "Description",
      accessorKey: "description",
    },
    {
      name: "Change Type",
      accessorKey: "get_change_type_display",
    },
    {
      name: "Amount Type",
      accessorKey: "get_amount_type_display",
    },
    {
      name: "Amount",
      accessorKey: "amount",
    },
  ]);

  const handleSave = async (requestBody) => {
    try {
      setIsLoading(true);
      console.log("requestBody", requestBody);
      const response = (
        await axios.put(
          `${apiURL}/api/customers/${requestBody.id}`,
          requestBody,
          getHeaderOptions(token)
        )
      ).data;
      // setToastInfo({type:"success", message:"Customer Added successfully."});
      console.log("Response", response);
      setCustomerData((prev) => ({ ...prev, ...response }));
      setIsEditing(false);
    } catch (error) {
      console.log("error", error);
      // setToastInfo({type:"error", message:"Something went wrong."});
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (requestBody) => {
    try {
      setIsTableLoading(true);
      console.log("requestBody", requestBody);
      let body = { ...requestBody };
      if (body.get_change_type_display !== "Deposit") {
        body["payment_type"] = null;
      }
      const response = (
        await axios.post(
          `${apiURL}/api/booklog/${customerData.id}`,
          body,
          getHeaderOptions(token)
        )
      ).data;
      // setToastInfo({type:"success", message:"Customer Added successfully."});
      console.log("Response", response);
      getCustomerHistory();
      setShowHistoryModal(false);
    } catch (error) {
      console.log("error", error);
      // setToastInfo({type:"error", message:"Something went wrong."});
    } finally {
      setIsTableLoading(false);
    }
  };

  const getCustomerHistory = useCallback(async (pageNumber, searchText) => {
    try {
      setIsTableLoading(true);
      const response = (
        await axios.get(`${apiURL}/api/booklog/${customerId}`, {
          params: { page: pageNumber || 1, search: searchText },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      setCustomerDetail(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsTableLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    debounce((value) => getCustomerHistory(1, value)),
    []
  );

  useEffect(() => {
    getCustomer();
    getCustomerHistory();
  }, []);

  return (
    <div className="top-div">
      {isLoading && <SpinnerOverlay />}
      {Object.keys(customerData)?.length ? (
        <div>
          <Formik
            initialValues={customerData}
            validate={validateCustomer}
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
                        onClick={() => navigate("/customers")}
                      >
                        <box-icon size="md" name="chevron-left"></box-icon>
                      </div>
                    }
                    title={
                      <Form.Group className="d-flex align-center gap-1">
                        {isEditing ? (
                          <>
                            <Form.Control
                              className="border-0 shadow-none customer-value-name"
                              name="customer_name"
                              type="text"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                errors.customer_name && touched.customer_name
                              }
                              value={values.customer_name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.customer_name}
                            </Form.Control.Feedback>
                          </>
                        ) : (
                          <h4 className="pt-1">{customerData.customer_name}</h4>
                        )}
                      </Form.Group>
                    }
                    rightButton={
                      <div className="d-flex gap-4">
                        {isEditing ? (
                          <>
                            <Button
                              className="customer-edit rounded-3"
                              onClick={() => handleSubmit()}
                              disabled={!isValid || !dirty}
                            >
                              Save
                            </Button>
                            <Button
                              className="customer-edit rounded-3"
                              variant="secondary"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              className="customer-edit rounded- details-button"
                              onClick={() => setIsEditing(true)}
                            >
                              Edit
                            </Button>
                            <Button
                              className="rounded-3 details-button"
                              onClick={() => {}}
                            >
                              Statement
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
                              <td class="fw-bolder pb-0">Id</td>
                              <td class="fw-bolder pb-0">Balance</td>
                              <td class="fw-bolder pb-0"> GST Number</td>
                              <td class="fw-bolder pb-0">Is Active</td>
                            </tr>
                            <tr>
                              <td class="pt-0"> {customerData.customer_id}</td>
                              <td class="pt-0">
                                {customerData.customer_balance}
                              </td>
                              <td class="pt-0">{customerData.customer_gst}</td>
                              <td class="pt-0">
                                {isEditing ? (
                                  <>
                                    <Form.Check
                                      type="switch"
                                      className="customer-value-is-active"
                                      name="customer_is_active"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.customer_is_active}
                                      defaultChecked={values.customer_is_active}
                                    />
                                  </>
                                ) : (
                                  <a>
                                    {customerData.customer_is_active
                                      ? "Active"
                                      : "Disabled"}
                                  </a>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td class="fw-bolder pb-0 pt-3">Email</td>
                              <td class="fw-bolder pb-0 pt-3">
                                Contact Number
                              </td>
                              <td class="fw-bolder pb-0 pt-3" colspan="2">
                                Adddress
                              </td>
                            </tr>
                            <tr>
                              <td class="py-0">
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      className="border-0 shadow-none customer-value"
                                      name="customer_email"
                                      type="text"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.customer_email &&
                                        touched.customer_email
                                      }
                                      value={values.customer_email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.customer_email}
                                    </Form.Control.Feedback>
                                  </>
                                ) : (
                                  <a>{customerData.customer_email}</a>
                                )}
                              </td>
                              <td class="py-0">
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      className="border-0 shadow-none customer-value"
                                      name="customer_contact_number"
                                      type="number"
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
                                  </>
                                ) : (
                                  <a>{customerData.customer_contact_number}</a>
                                )}
                              </td>
                              <td class="py-0" colspan="2">
                                {" "}
                                {isEditing ? (
                                  <>
                                    <Form.Control
                                      className="border-0 shadow-none customer-value"
                                      name="customer_address"
                                      type="text"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.customer_address &&
                                        touched.customer_address
                                      }
                                      value={values.customer_address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.customer_address}
                                    </Form.Control.Feedback>
                                  </>
                                ) : (
                                  <a>{customerData.customer_address}</a>
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
      {showHistoryModal && (
        <AddCustomerHistoryModal
          setShowModal={setShowHistoryModal}
          handleSave={handleAdd}
        />
      )}
      <CustomTable
        className={"history-table"}
        isLoading={isTableLoading}
        title={"Customer History"}
        headers={customerHistoryHeader}
        records={customerDetail?.results}
        totalRecords={customerDetail?.count}
        primaryBtnHeader={"Add"}
        primaryBtnHandler={() => setShowHistoryModal(true)}
        pageNumber={pageNumber}
        setPageNumber={setPagination}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default CustomerDetails;
