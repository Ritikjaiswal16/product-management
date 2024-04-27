import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import SpinnerOverlay from "../Components/SpinnerOverlay";
import axios from "axios";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import CustomTable from "../Table/CustomTable";
import { debounce } from "../Utils/utils";
import moment from "moment";
import './ProductDetails.css';
import '../DetailsView.css';
import { Formik } from "formik";
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
    }

    const validateProduct = (values) => {
        let errors = {};
        if (!values.product_sp_credit) {
            errors.product_sp_credit = "Please provide credit price"
        }
        if (!values.product_gst_percentage) {
            errors.product_gst_percentage = "Please provide GST number"
        }
        if (!values.product_sp_gst) {
            errors.product_sp_gst = "Please provide estimated selling price including GST"
        }
        if (!values.product_notify_count) {
            errors.product_notify_count = "Please provide notify count to remind when reach that value"
        }
        return errors;
    }

    const getProduct = async () => {
        try {
            setIsLoading(true);
            const response = (await axios.get(`http://192.168.1.13:8000/api/products/${productId}`, getHeaderOptions(token))).data;
            setProductData(response);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }

    const productHistoryHeader = Object.freeze([
        {
            name: "Purchased From",
            accessorKey: 'customer_name',
        },
        {
            name: "Cost Price",
            accessorKey: 'cost_price'
        },
        {
            name: "Quantity",
            accessorKey: 'change',
        },
        {
            name: "Type",
            accessorKey: 'get_change_type_display',
        },
        {
            name: "Batch Number",
            accessorKey: 'batch_number',
        },
        {
            name: "Expiry Date",
            accessorKey: 'expiry_date',
            onClick: (value) => {
                let testDateUtc = moment.utc(value.expiry_date).local();
                return testDateUtc.format('L');
            }
        },
        {
            name: "Transaction Date",
            accessorKey: 'date',
            onClick: (value) => {
                let testDateUtc = moment.utc(value.date).local();
                return testDateUtc.format('DD/MM/YYYY, h:m');
            }
        },
        {
            name: "Description",
            accessorKey: 'description',
        }
    ])

    const handleSave = async (requestBody) => {
        const body = {
            ...requestBody,
            "product_notify_count": requestBody.product_notify_count,
            "product_gst_percentage": requestBody.product_gst_percentage,
            "product_sp_gst": requestBody.product_sp_gst,
            "product_sp_credit": requestBody.product_sp_credit
        }
        try {
            setIsLoading(true);
            console.log("requestBody", requestBody);
            const response = (await axios.put(`http://192.168.1.13:8000/api/products/${requestBody.product_id}`, body, getHeaderOptions(token))).data;
            // setToastInfo({type:"success", message:"Product Added successfully."});
            console.log("Response", response);
            setProductData((prev) => ({ ...prev, ...response }))
            setIsEditing(false)
        } catch (error) {
            console.log("error", error);
            // setToastInfo({type:"error", message:"Something went wrong."});
        } finally {
            setIsLoading(false);
        }
    }

    const getProductHistory = useCallback(async (pageNumber, searchText) => {
        try {
            setIsTableLoading(true);
            const response = (await axios.get(`http://192.168.1.13:8000/api/products/logs/${productId}`, { params: { page: pageNumber || 1, search: searchText }, ...getHeaderOptions(token) })).data;
            console.log("Response", response);
            setProductDetail(response);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsTableLoading(false);
        }
    }, [])

    const handleSearch = useCallback(debounce((value) => getProductHistory(1, value)), []);

    useEffect(() => {
        getProduct();
        getProductHistory();
    }, [])

    return (<div className="top-div">
        {isLoading && <SpinnerOverlay />}
        {Object.keys(productData)?.length ? (
            <div className="basic-details">
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
                        dirty
                    }) => (
                        <>
                            <Form noValidate onSubmit={handleSubmit}>
                                <div className="d-flex justify-content-between pb-0 basic-details-heading">
                                    <Form.Group className="d-flex align-center gap-1">
                                    <div className="details-back-btn" onClick={() => navigate("/products")}><box-icon size="md" name='chevron-left'></box-icon></div>
                                        <h4 className="pt-1">{productData.product_name}</h4>
                                    </Form.Group>
                                    {isEditing ?
                                        <Button className="product-edit rounded-3" onClick={handleSubmit} disabled={!isValid || !dirty}>Save</Button>
                                        : <Button className="product-edit rounded-3" onClick={() => setIsEditing(true)} >Edit</Button>
                                    }
                                </div>
                                <hr></hr> 
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
                                    <td class="pt-0"> {productData.product_manufacturer}</td>
                                    <td class="pt-0">{productData.product_hsn}</td>
                                    <td class="pt-0">{productData.product_net_quantity + " " + productData.product_measure_unit}</td>
                                    <td class="pt-0">{productData.product_total_count}</td>
                                    </tr>
                                    <tr>
                                    <td class="fw-bolder pb-0 pt-3">Selling Price</td>
                                    <td class="fw-bolder pb-0 pt-3">Credit price</td>
                                    <td class="fw-bolder pb-0 pt-3">GST %</td>
                                    <td class="fw-bolder pb-0 pt-3">Notify Count</td>
                                    </tr>
                                    <tr>
                                    <td class="py-0">{isEditing ? <><Form.Control
                                                className="border-0 shadow-none product-value"
                                                name="product_sp_gst"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.product_sp_gst && touched.product_sp_gst}
                                                value={values.product_sp_gst}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.product_sp_gst}
                                                </Form.Control.Feedback></> : <a>{productData.product_sp_gst}</a> }</td>
                                    <td class="py-0">{isEditing ? <><Form.Control
                                                className="border-0 shadow-none product-value"
                                                name="product_sp_credit"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.product_sp_credit && touched.product_sp_credit}
                                                value={values.product_sp_credit}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.product_sp_credit}
                                                </Form.Control.Feedback></> : <a>{productData.product_sp_credit}</a>}</td>
                                    <td class="py-0">{isEditing ? <><Form.Control
                                                className="border-0 shadow-none product-value"
                                                name="product_gst_percentage"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.product_gst_percentage && touched.product_gst_percentage}
                                                value={values.product_gst_percentage}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.product_gst_percentage}
                                                </Form.Control.Feedback></> : <a>{productData.product_gst_percentage}</a>}</td>
                                    <td class="py-0">{isEditing ? <><Form.Control
                                                className="border-0 shadow-none product-value"
                                                name="product_notify_count"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.product_notify_count && touched.product_notify_count}
                                                value={values.product_notify_count}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.product_notify_count}
                                                </Form.Control.Feedback></> : <a>{productData.product_notify_count}</a>}</td>
                                    </tr>
                                </tbody>
                                </table>
                                </div>
                           

                            </Form>
                        </>
                    )}
                </Formik>
            </div>
        )
            : null}
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
    </div>)
}

export default ProductDetails;