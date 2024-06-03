import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../Table/CustomTable";
import axios from "axios";
import { useAuth } from "../Routes/AuthProvider";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import Toaster from "../Components/Toaster";
import { debounce } from "../Utils/utils";
import { useNavigate } from "react-router-dom";
import AddInvoice from "./AddInvoice";
import "./Invoice.css";
import moment from "moment";

const Invoices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [toastInfo, setToastInfo] = useState(null);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [invoiceDetails, setInvoiceDetails] = useState([]);

  const setPagination = (number = 1) => {
    getInvoice(number);
    setPageNumber(number);
  };
  const invoiceHeader = Object.freeze([
    {
      name: "Number",
      accessorKey: "invoice_number",
    },
    {
      name: "Customer Name",
      accessorKey: "customer_name",
    },
    {
      name: "Customer Id",
      accessorKey: "customer_id",
    },
    {
      name: "Date",
      accessorKey: "date",
      onClick: (value) => {
        let testDateUtc = moment.utc(value.date).local();
        return testDateUtc.format("DD/MM/YYYY, hh:mm A");
      },
    },
    {
      name: "Type",
      accessorKey: "invoice_type",
    },
    {
      name: "Amount",
      accessorKey: "total_amount",
    },
  ]);

  const getInvoice = useCallback(async (pageNumber, searchText) => {
    try {
      setIsLoading(true);
      const response = (
        await axios.get(`${apiURL}/api/invoice`, {
          params: { page: pageNumber || 1, search: searchText },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      setInvoiceDetails(response);
    } catch (error) {
      console.log("error", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    getInvoice();
  }, []);

  const dropdownOptions = [
    {
      name: (
        <div class="btn-group">
          <button type="button" class="btn btn-outline-primary">
            <i class="bi bi-eye-fill"></i>
          </button>
          <button type="button" class="btn btn-outline-success">
            <i class="bi bi-printer-fill"></i>
          </button>
          <button type="button" class="btn btn-outline-danger">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="invoice-page" style={{ "justify-content": "center" }}>
      {showAddInvoiceModal && (
        <AddInvoice handleClose={() => setShowAddInvoiceModal(false)} />
      )}
      {toastInfo && (
        <Toaster
          variant={toastInfo.type}
          toastMessage={toastInfo.message}
          onClose={() => setToastInfo(null)}
        />
      )}
      <CustomTable
        className={"invoice-table"}
        isLoading={isLoading}
        isError={isError}
        title={"Invoices"}
        headers={invoiceHeader}
        records={invoiceDetails?.results}
        totalRecords={invoiceDetails?.count}
        primaryBtnHeader={"New Invoice"}
        primaryBtnHandler={() => setShowAddInvoiceModal(true)}
        pageNumber={pageNumber}
        setPageNumber={setPagination}
        handleSearch={() => {}}
        dropdownOptions={dropdownOptions}
      />
    </div>
  );
};

export default Invoices;
