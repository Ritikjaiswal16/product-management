import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../Table/CustomTable";
import axios from "axios";
import { useAuth } from "../Routes/AuthProvider";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import DeleteModal from "../Components/DeleteModal";
import Toaster from "../Components/Toaster";
import { debounce } from "../Utils/utils";
import { customerHeader } from "../Utils/TableUtils";
import AddCustomerModal from "./AddCustomerModal";
import './Customers.css';

const Customers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [ShowAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [toastInfo, setToastInfo] = useState(null);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const { token } = useAuth();

    const setPagination = (number = 1) => {
        getCustomers(number);
        setPageNumber(number);
    }

    const handleSearch = useCallback(debounce((value) => getCustomers(1, value)), []);

    const handleSave = async (requestBody) => {
        try {
            setIsLoading(true);
            console.log("requestBody", requestBody);
            let response;
            if(Object.keys(ShowAddCustomerModal).length){
                response = (await axios.put(`http://192.168.1.13:8000/api/customers/${ShowAddCustomerModal.product_id}`, requestBody, getHeaderOptions(token))).data;
                setToastInfo({type:"success", message:"Customer updated successfully."});
            } else{
                response = (await axios.post('http://192.168.1.13:8000/api/customers', requestBody, getHeaderOptions(token))).data;
                setToastInfo({type:"success", message:"Customer Added successfully."});
            }
            console.log("Response", response);
            setPagination(1);
            setShowAddCustomerModal(null);
        } catch (error) {
            console.log("error", error);
            setToastInfo({type:"error", message:"Something went wrong."});
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteCustomer = async (id) => {
        try{
            setIsLoading(true);
            await axios.delete(`http://192.168.1.13:8000/api/customers/${id}`, getHeaderOptions(token));
            setPagination(1);
            setShowDeleteModal(null);
            setToastInfo({type:"success", message:"Customer Deleted successfully."});
        }catch(error){
            console.log("error", error);
            setToastInfo({type:"error", message:"Something went wrong."});
        } finally {
            setIsLoading(false);
        }
    }

    const getCustomers = useCallback(async (pageNumber, searchText) => {
        try {
            setIsLoading(true);
            const response = (await axios.get('http://192.168.1.13:8000/api/customers',{ params: { page: pageNumber || 1, search: searchText }, ...getHeaderOptions(token) })).data;
            console.log("Response", response);
            setCustomerDetails(response);
        } catch (error) {
            console.log("error", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [])

    useEffect(() => {
        getCustomers();
    }, [])

    return (
        <div  className="customers-page" style={{ "justify-content": "center"}}>
            {toastInfo && <Toaster variant={toastInfo.type} toastMessage={toastInfo.message} onClose={() => setToastInfo(null)}/>}
            {ShowAddCustomerModal && 
                <AddCustomerModal 
                        showModal={ShowAddCustomerModal} 
                        setShowModal={setShowAddCustomerModal} 
                        handleSave={handleSave} 
                />
            }
            {showDeleteModal && 
                <DeleteModal 
                    title={`Delete "${showDeleteModal.id}" ?`} 
                    message={"Are you sure want to delete product? Product will be deleted permanently."} 
                    handleCancel={() => setShowDeleteModal(null)}
                    handleDelete={() => handleDeleteCustomer(showDeleteModal.id)}  
                />
            }
            <CustomTable
                className={"customers-table"}
                isLoading={isLoading}
                isError={isError}
                title={"Customers"}
                headers={customerHeader}
                records={customerDetails?.results}
                totalRecords={customerDetails?.count}
                primaryBtnHeader={"Add Customer"}
                primaryBtnHandler={() => setShowAddCustomerModal({})}
                handleRecordEdit={(values) => setShowAddCustomerModal(values)}
                handleDeleteRecord={setShowDeleteModal}
                pageNumber={pageNumber}
                setPageNumber={setPagination}
                handleSearch={handleSearch}
            />
        </div>

    )
}

export default Customers;