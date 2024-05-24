import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../Table/CustomTable";
import axios from "axios";
import { useAuth } from "../Routes/AuthProvider";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import Toaster from "../Components/Toaster";
import { debounce } from "../Utils/utils";
import AddCustomerModal from "./AddCustomerModal";
import "./Customers.css";
import { useNavigate } from "react-router-dom";
import PasswordLabel from "../Components/PasswordLabel";

const Customers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ShowAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [toastInfo, setToastInfo] = useState(null);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const { token } = useAuth();
  const navigate = useNavigate();

  const customerHeader = [
    {
      name: "Id",
      accessorKey: "customer_id",
    },
    {
      name: "Name",
      accessorKey: "customer_name",
      link: (values) => navigate(`/customers/${values.id}`),
    },
    {
      name: "Address",
      accessorKey: "customer_address",
    },
    {
      name: "GST Number",
      accessorKey: "customer_gst",
    },
    {
      name: "Email",
      accessorKey: "customer_email",
    },
    {
      name: "Contact Number",
      accessorKey: "customer_contact_number",
    },
    {
      name: "Balance",
      accessorKey: "customer_balance",
    },
    {
      name: "Status",
      accessorKey: "customer_is_active",
      onClick: (record) => {
        return record.customer_is_active ? "Active" : "Disabled";
      },
    },
  ];

  const setPagination = (number = 1) => {
    getCustomers(number);
    setPageNumber(number);
  };

  const handleSearch = useCallback(
    debounce((value) => getCustomers(1, value)),
    []
  );

  const handleSave = async (requestBody, isUpdatingFor) => {
    try {
      setIsLoading(true);
      let response;
      response = (
        await axios.post(
          `${apiURL}/api/customers`,
          requestBody,
          getHeaderOptions(token)
        )
      ).data;
      setToastInfo({
        type: "success",
        message: "Customer Added successfully.",
      });
      console.log("Response", response);
      setPagination(1);
      setShowAddCustomerModal(null);
    } catch (error) {
      console.log("error", error);
      setToastInfo({ type: "error", message: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomers = useCallback(async (pageNumber, searchText) => {
    try {
      setIsLoading(true);
      const response = (
        await axios.get(`${apiURL}/api/customers`, {
          params: { page: pageNumber || 1, search: searchText },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      setCustomerDetails(response);
    } catch (error) {
      console.log("error", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCustomers();
  }, []);

  const dropdownOptions = [
    {
      name: "View",
      onClick: (values) => navigate(`/customers/${values.id}`),
    },
    {
      name: "Active/Disable",
      onClick: (values) => {
        const requestBody = {
          ...values,
          // customer_contact_number: "912921546",
          customer_is_active: !values.customer_is_active,
        };
        handleSave(requestBody, values.id);
      },
    },
  ];

  return (
    <div className="customers-page" style={{ "justify-content": "center" }}>
      {/* <PasswordLabel value={"something"}/> */}
      {toastInfo && (
        <Toaster
          variant={toastInfo.type}
          toastMessage={toastInfo.message}
          onClose={() => setToastInfo(null)}
        />
      )}
      {ShowAddCustomerModal && (
        <AddCustomerModal
          showModal={ShowAddCustomerModal}
          setShowModal={setShowAddCustomerModal}
          handleSave={handleSave}
        />
      )}
      <CustomTable
        className={"customers-table"}
        isLoading={isLoading}
        isError={isError}
        title={"Customers"}
        headers={customerHeader}
        records={customerDetails?.results}
        totalRecords={customerDetails?.count}
        primaryBtnHeader={"Add"}
        primaryBtnHandler={() => setShowAddCustomerModal({})}
        pageNumber={pageNumber}
        setPageNumber={setPagination}
        handleSearch={handleSearch}
        dropdownOptions={dropdownOptions}
      />
    </div>
  );
};

export default Customers;
