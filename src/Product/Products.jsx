import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../Table/CustomTable";
import axios from "axios";
import AddProductModal from "./AddProductModal";
import { useAuth } from "../Routes/AuthProvider";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import { DeleteModal, Toaster } from "../Components";
import { debounce } from "../Utils/utils";
import { useNavigate } from "react-router-dom";
import './Product.css';

const Products = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [toastInfo, setToastInfo] = useState(null);
    const [productDetails, setProductDetails] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const { token } = useAuth();
    const navigate = useNavigate();

    const setPagination = (number = 1) => {
        getProducts(number);
        setPageNumber(number);
    }

    const productHeader = Object.freeze([
        {
            name: "Name",
            accessorKey: 'product_name',
            link: (values) => navigate(`/products/${values.product_id}`)
        },
        {
            name: "Manufacturer",
            accessorKey: 'product_manufacturer'
        },
        {
            name: "Net Quantity",
            accessorKey: 'product_net_quantity',
            onClick: (value) => {
                return (value.product_net_quantity + " " + value.product_measure_unit)
            }
        },
        {
            name: "Selling Price",
            accessorKey: 'product_sp_gst',
        },
        {
            name: "Credit Price",
            accessorKey: 'product_sp_credit',
        },
        {
            name: "GST %",
            accessorKey: 'product_gst_percentage',
        },
        {
            name: "Total Quantity",
            accessorKey: 'product_total_count',
        }
    ])

    const handleSearch = useCallback(debounce((value) => getProducts(1, value)), []);

    const handleSave = async (requestBody) => {
        try {
            setIsLoading(true);
            console.log("requestBody", requestBody);
            let response;
            if (Object.keys(showAddProductModal).length) {
                response = (await axios.put(`http://192.168.1.13:8000/api/products/${showAddProductModal.product_id}`, requestBody, getHeaderOptions(token))).data;
                setToastInfo({ type: "success", message: "Product updated successfully." });
            } else {
                response = (await axios.post('http://192.168.1.13:8000/api/products', requestBody, getHeaderOptions(token))).data;
                setToastInfo({ type: "success", message: "Product Added successfully." });
            }
            console.log("Response", response);
            setPagination(1);
            setShowAddProductModal(null);
        } catch (error) {
            console.log("error", error);
            setToastInfo({ type: "error", message: "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteProduct = async (productId) => {
        try {
            setIsLoading(true);
            await axios.delete(`http://192.168.1.13:8000/api/products/${productId}`, getHeaderOptions(token));
            setPagination(1);
            setShowDeleteModal(null);
            setToastInfo({ type: "success", message: "Product Deleted successfully." });
        } catch (error) {
            console.log("error", error);
            setToastInfo({ type: "error", message: "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    }

    const getProducts = useCallback(async (pageNumber, searchText) => {
        try {
            setIsLoading(true);
            const response = (await axios.get('http://192.168.1.13:8000/api/products', { params: { page: pageNumber || 1, search: searchText }, ...getHeaderOptions(token) })).data;
            console.log("Response", response);
            setProductDetails(response);
        } catch (error) {
            console.log("error", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [])

    useEffect(() => {
        getProducts();
    }, [])

    const dropdownOptions = [
        {
            name: "View",
            onClick: (values) => navigate(`/products/${values.product_id}`)
        },
        {
            name: "Delete",
            onClick: setShowDeleteModal,
            className: "delete-button"
        },
    ]

    return (
        <div className="product-page">
            {toastInfo && <Toaster variant={toastInfo.type} toastMessage={toastInfo.message} onClose={() => setToastInfo(null)} />}
            {showAddProductModal &&
                <AddProductModal
                    showModal={showAddProductModal}
                    setShowModal={setShowAddProductModal}
                    handleSave={handleSave}
                />
            }
            {showDeleteModal &&
                <DeleteModal
                    title={`Delete "${showDeleteModal.product_name}" ?`}
                    message={"Are you sure want to delete product?\n Product will be deleted permanently."}
                    handleCancel={() => setShowDeleteModal(null)}
                    handleDelete={() => handleDeleteProduct(showDeleteModal.product_id)}
                />
            }
            <CustomTable
                className={"product-table"}
                isLoading={isLoading}
                isError={isError}
                title={"Products"}
                headers={productHeader}
                records={productDetails?.results}
                totalRecords={productDetails?.count}
                primaryBtnHeader={"Add"}
                primaryBtnHandler={() => setShowAddProductModal({})}
                dropdownOptions={dropdownOptions}
                pageNumber={pageNumber}
                setPageNumber={setPagination}
                handleSearch={handleSearch}
            />
        </div>

    )
}

export default Products;