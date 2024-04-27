import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../Table/CustomTable";
import axios from "axios";
import { useAuth } from "../Routes/AuthProvider";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import Toaster from "../Components/Toaster";
import { debounce } from "../Utils/utils";
import { customerHeader } from "../Utils/TableUtils";
import { useNavigate } from "react-router-dom";
import AddInvoice from "./AddInvoice";

const Invoices = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
    const [toastInfo, setToastInfo] = useState(null);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const { token } = useAuth();
    const navigate = useNavigate();

    const setPagination = (number = 1) => {
        getCustomers(number);
        setPageNumber(number);
    }

    const dropdownOptions = [
        {
            name: "View",
            onClick: (values) => setShowAddInvoiceModal(true)
        },
        {
            name: "Active/Disable",
            onClick: (values) => { 
                const requestBody = {
                    ...values,
                    // customer_contact_number: "912921546",
                    customer_is_active: !values.customer_is_active
                }
                handleSave(requestBody, values.id)
            }
        },
    ]

    return (
        <div  className="customers-page" style={{ "justify-content": "center"}}>
            {showAddInvoiceModal && <AddInvoice handleClose={() => setShowAddInvoiceModal(false)}/>}
            {toastInfo && <Toaster variant={toastInfo.type} toastMessage={toastInfo.message} onClose={() => setToastInfo(null)}/>}
            <CustomTable
                className={"customers-table"}
                isLoading={isLoading}
                isError={isError}
                title={"Invoices"}
                headers={customerHeader}
                records={customerDetails?.results}
                totalRecords={customerDetails?.count}
                primaryBtnHeader={"New Invoice"}
                primaryBtnHandler={() => setShowAddInvoiceModal(true)}
                pageNumber={pageNumber}
                setPageNumber={setPagination}
                handleSearch={() =>{}}
                dropdownOptions={dropdownOptions}
            />
        </div>

    )
}

export default Invoices;