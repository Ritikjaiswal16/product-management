import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import SpinnerOverlay from "../Components/SpinnerOverlay";
import axios from "axios";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import CustomTable from "../Table/CustomTable";
import { debounce } from "../Utils/utils";
import moment from "moment";
import './CustomerDetails.css';
import { Formik } from "formik";
import AddCustomerHistoryModal from "./AddCustomerHistoryModal";

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

    const setPagination = (number = 1) => {
        getCustomerHistory(number);
        setPageNumber(number);
    }

    const validateCustomer = (values) => {
        console.log(values)
        let errors = {};
        if (!values.customer_name) {
            errors.customer_name = "Please provide customer name"
        }
        if (!values.customer_address) {
            errors.customer_address = "Please provide address of the customer"
        }
        if (!values.customer_contact_number) {
            errors.customer_contact_number = "Please provide contact number"
        } else if (!/[0-9]{10}/.test(values.customer_contact_number)) {
            errors.customer_contact_number = "Please provide valid contact number"
        }
        if (values.customer_email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.customer_email)) {
            errors.customer_email = "Please provide valid email address"
        }
        return errors;
    }

    const getCustomer = async () => {
        try {
            setIsLoading(true);
            const response = (await axios.get(`http://192.168.1.13:8000/api/customers/${customerId}`, getHeaderOptions(token))).data;
            setCustomerData(response);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }

    const customerHistoryHeader = Object.freeze([
        {
            name: "Date",
            accessorKey: 'date',
            onClick: (value) => {
                let testDateUtc = moment.utc(value.date).local();
                return testDateUtc.format('DD/MM/YYYY, hh:mm A');
            }
        },
        {
            name: "Payment Type",
            accessorKey: 'payment_type'
        },
        {
            name: "Description",
            accessorKey: 'description',
        },
        {
            name: "Change Type",
            accessorKey: 'get_change_type_display',
        },
        {
            name: "Amount Type",
            accessorKey: 'get_amount_type_display',
        },
        {
            name: "Amount",
            accessorKey: 'amount',
        }
    ])

    const handleSave = async (requestBody) => {
        try {
            setIsLoading(true);
            console.log("requestBody", requestBody);
            const response = (await axios.put(`http://192.168.1.13:8000/api/customers/${requestBody.id}`, requestBody, getHeaderOptions(token))).data;
            // setToastInfo({type:"success", message:"Customer Added successfully."});
            console.log("Response", response);
            setCustomerData((prev) => ({ ...prev, ...response }))
            setIsEditing(false)
        } catch (error) {
            console.log("error", error);
            // setToastInfo({type:"error", message:"Something went wrong."});
        } finally {
            setIsLoading(false);
        }
    }

    const handleAdd = async (requestBody) => {
        try {
            setIsTableLoading(true);
            console.log("requestBody", requestBody);
            let body = {...requestBody};
            if(body.get_change_type_display !== "Deposit"){
                body['payment_type'] = null;
            }
            const response = (await axios.post(`http://192.168.1.13:8000/api/booklog/${customerData.id}`, body, getHeaderOptions(token))).data;
            // setToastInfo({type:"success", message:"Customer Added successfully."});
            console.log("Response", response);
            getCustomerHistory();
            setShowHistoryModal(false)
        } catch (error) {
            console.log("error", error);
            // setToastInfo({type:"error", message:"Something went wrong."});
        } finally {
            setIsTableLoading(false);
        }
    }

    const getCustomerHistory = useCallback(async (pageNumber, searchText) => {
        try {
            setIsTableLoading(true);
            const response = (await axios.get(`http://192.168.1.13:8000/api/booklog/${customerId}`, { params: { page: pageNumber || 1, search: searchText }, ...getHeaderOptions(token) })).data;
            console.log("Response", response);
            setCustomerDetail(response);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsTableLoading(false);
        }
    }, [])

    const handleSearch = useCallback(debounce((value) => getCustomerHistory(1, value)), []);

    useEffect(() => {
        getCustomer();
        getCustomerHistory();
    }, [])

    return (<div className="customer-top-div">
        {isLoading && <SpinnerOverlay />}
        {Object.keys(customerData)?.length ? (
            <div className="customer-basic-details">
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
                        dirty
                    }) => (
                        <>
                            <Form noValidate onSubmit={handleSubmit}>
                                <div className="m-3 d-flex justify-content-between">
                                    <Form.Group>
                                        {isEditing ? <><Form.Control
                                            className="border-0 shadow-none customer-value-name"
                                            name="customer_name"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.customer_name && touched.customer_name}
                                            value={values.customer_name}
                                        />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.customer_name}
                                            </Form.Control.Feedback></> : <h1>{customerData.customer_name}</h1>}

                                    </Form.Group>
                                    <div className="d-flex gap-4">
                                        {isEditing ?
                                            <>
                                                <Button className="customer-edit rounded-3" onClick={() => handleSubmit()} disabled={!isValid || !dirty}>Save</Button>
                                                <Button className="customer-edit rounded-3" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                            </>
                                            :
                                            <> 
                                            <Button className="customer-edit rounded-3" onClick={() => setIsEditing(true)} >Edit</Button>
                                            <Button className="rounded-3" onClick={() => {}}>Statement</Button>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="d-flex gap-4 m-3 justify-content-start">
                                    <Card className="customer-company customer-card-border">
                                        <div className="p-3">
                                            <h6 className="fw-normal">Id</h6>
                                            <h6>{customerData.customer_id}</h6>
                                        </div>
                                    </Card>
                                    <Card className="w-25 customer-card-border">
                                        <div className="p-3">
                                            <h6 className="fw-normal">Balance</h6>
                                            <h6>{customerData.customer_balance}</h6>
                                        </div>
                                    </Card>
                                    <Card className="w-25 customer-card-border">
                                        <div className="p-3">
                                            <h6 className="fw-normal">GST Number</h6>
                                            <h6>{customerData.customer_gst}</h6>
                                        </div>
                                    </Card>
                                    <Card className="w-25 customer-card-border">
                                        <div className="p-3">
                                            <h6 className="fw-normal">Is Active</h6>
                                            {isEditing ? <><Form.Check
                                                type="switch"
                                                className="customer-value-is-active"
                                                name="customer_is_active"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.customer_is_active}
                                                defaultChecked={values.customer_is_active}
                                            /></> :
                                                <h6>{customerData.customer_is_active ? "Active" : "Disabled"}</h6>}
                                        </div>
                                    </Card>
                                </div>
                                <div className="d-flex gap-4 justify-content-center m-3">
                                    <Card className="customer-value-address customer-card-border">
                                        <div className="p-3">
                                            <h6 className="fw-normal">Adddress</h6>
                                            {isEditing ? <><Form.Control
                                                className="border-0 shadow-none customer-value"
                                                name="customer_address"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.customer_address && touched.customer_address}
                                                value={values.customer_address}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.customer_address}
                                                </Form.Control.Feedback></> : <h6>{customerData.customer_address}</h6>}
                                        </div>
                                    </Card>
                                    <Card className="customer-basic-meta customer-card-border">
                                        <div className="p-3">
                                            <h6 className="fw-normal">Email</h6>
                                            {isEditing ? <><Form.Control
                                                className="border-0 shadow-none customer-value"
                                                name="customer_email"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.customer_email && touched.customer_email}
                                                value={values.customer_email}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.customer_email}
                                                </Form.Control.Feedback></> : <h6>{customerData.customer_email}</h6>}
                                        </div>
                                    </Card>
                                    <Card className="customer-basic-meta customer-card-border">
                                        <div className="p-3">
                                            <h6 className="fw-normal">Contact Number</h6>
                                            {isEditing ? <><Form.Control
                                                className="border-0 shadow-none customer-value"
                                                name="customer_contact_number"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.customer_contact_number && touched.customer_contact_number}
                                                value={values.customer_contact_number}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.customer_contact_number}
                                                </Form.Control.Feedback></> : <h6>{customerData.customer_contact_number}</h6>}
                                        </div>
                                    </Card>
                                </div>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
        )
            : null}
        { showHistoryModal &&
            <AddCustomerHistoryModal
            setShowModal={setShowHistoryModal}
            handleSave={handleAdd}
            />
        }
        <CustomTable
            className={"customer-history-table mt-4"}
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
    </div>)
}

export default CustomerDetails;