import React, { useCallback, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './ProductDetails.css';
import SpinnerOverlay from "../Components/SpinnerOverlay";
import axios from "axios";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import CustomTable from "../Table/CustomTable";
import { debounce } from "../Utils/utils";

const ProductDetails = () => {
    const { productId } = useParams();
    const { token } = useAuth();
    const [productData, setProductData] = useState({});
    const [productDetail, setProductDetail] = useState({});
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState();
    const [isTableLoading, setIsTableLoading] = useState();

    const setPagination = (number = 1) => {
        getProducts(number);
        setPageNumber(number);
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
            name: "Done On",
            accessorKey: 'date',
        },
        {
            name: "Description",
            accessorKey: 'description',
        }
    ])

    const getProductHistory = useCallback(async (pageNumber, searchText) => {
        try {
            setIsLoading(true);
            const response = (await axios.get(`http://192.168.1.13:8000/api/inventory/${productId}`,{ params: { page: pageNumber || 1, search: searchText }, ...getHeaderOptions(token) })).data;
            console.log("Response", response);
            setProductDetail(response);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const handleSearch = useCallback(debounce((value) => getProductHistory(1, value)), []);

    useEffect(() => {
        getProduct();
        getProductHistory();
    }, [])

    return (<div className="product-top-div m-5">
        {isLoading && <SpinnerOverlay />}
        {Object.keys(productData)?.length ? (
            <div className="product-basic-details">
                <div className="m-3"><h1>{productData.product_name}</h1></div>
                <div className="d-flex gap-4 m-3 justify-content-start">
                    <Card className="product-company product-card-border">
                        <div className="p-3">
                            <h6 className="fw-normal">Manufactorer</h6>
                            <h4>{productData.product_manufacturer}</h4>
                        </div>
                    </Card>
                    <Card className="w-25 product-card-border">
                        <div className="p-3">
                            <h6 className="fw-normal">HSN Code</h6>
                            <h4>{productData.product_hsn}</h4>
                        </div>
                    </Card>
                    <Card className="w-25 product-card-border">
                        <div className="p-3">
                            <h6 className="fw-normal">Net Quantity</h6>
                            <h4>{productData.product_net_quantity}</h4>
                        </div>
                    </Card>
                </div>
                <div className="d-flex gap-4 justify-content-center m-3">
                    <Card className="product-basic-meta product-card-border">
                        <div className="p-3">
                            <h6 className="fw-normal">Selling Price</h6>
                            <h4>{productData.product_sp_gst}</h4>
                        </div>
                    </Card>
                    <Card className="product-basic-meta product-card-border">
                        <div className="p-3">
                            <h6 className="fw-normal">Credit price</h6>
                            <h4>{productData.product_sp_credit}</h4>
                        </div>
                    </Card>
                    <Card className="product-basic-meta product-card-border">
                        <div className="p-3">
                            <h6 className="fw-normal">GST %</h6>
                            <h4>{productData.product_gst_percentage}</h4>
                        </div>
                    </Card>
                    <Card className="product-basic-meta product-card-border">
                        <div className="p-3">
                            <h6 className="fw-normal">Notify Count</h6>
                            <h4>{productData.product_notify_count}</h4>
                        </div>
                    </Card>
                </div>
            </div>
        )
            : null}
            <CustomTable
                className={"product-history-table mt-4"}
                isLoading={isLoading}
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