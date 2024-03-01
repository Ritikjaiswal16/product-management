import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../Table/CustomTable";
import { productHeader, productsMetadata } from "../Utils/TableUtils";
import axios from "axios";
import AddProductModal from "./AddProductModal";
import { Toast } from "react-bootstrap";
import { useAuth } from "../Routes/AuthProvider";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import './Product.css';

const Products = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [productDetails, setProductDetails] = useState([]);
    const { token } = useAuth();

    const handleSave = async (requestBody) => {
        try {
            setIsLoading(true);
            console.log("requestBody", requestBody);
            const response = (await axios.post('http://192.168.1.13:8000/api/products/add', requestBody, getHeaderOptions(token))).data;
            console.log("Response", response);
            getProducts();
            setShowModal(false);
            setToastMessage("PRoducr Added successfully.");
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }

    const getProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = (await axios.get('http://192.168.1.13:8000/api/products', getHeaderOptions(token))).data;
            console.log("Response", response);
            setProductDetails(response);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }, [])

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <div className="product-page">
            {toastMessage &&
                //  <ToastContainer className="position-static" position="bottom-end">
                <Toast
                    className="position-fixed bottom-0 end-0"
                    style={{ "z-index": "11" }}
                    bg={"success"}
                    autohide
                    show
                >

                    <Toast.Body>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
                // </ToastContainer>
            }
            {showModal && <AddProductModal showModal={showModal} setShowModal={setShowModal} handleSave={handleSave} />}
            <CustomTable
                isLoading={isLoading}
                tableMetadata={productsMetadata}
                headers={productHeader}
                records={productDetails?.results}
                totalRecords={productDetails?.count}
                primaryBtnHeader={"Add Product"}
                primaryBtnHandler={() => setShowModal(true)}
            />
        </div>

    )
}

export default Products;