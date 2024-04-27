import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import { debounce } from "../Utils/utils";
import axios from "axios";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { AddCustomerForm } from "../Customers/AddCustomerModal";

const AddInvoice = ({ handleClose }) => {
  const [customerDetails, setCustomerDetails] = useState([]);
  const [addNewCustomer, setAddNewCustomer] = useState(false);
  const { token } = useAuth();

  console.log("customer Details", customerDetails);

  useEffect(() => {
    getCustomers();
  }, []);

  const handleSearch = useCallback(
    debounce((value, callback) => getCustomers(value, callback)),
    []
  );

  const getCustomers = async (value, callback) => {
    try {
      // setIsLoading(true);
      const response = (
        await axios.get("http://192.168.1.13:8000/api/customers", {
          params: { page: 1, search: value },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      callback(response.results);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Modal show={true} className="w-100 h-100" onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select customer and transaction type</Modal.Title>
      </Modal.Header>
      <div className="d-flex gap-4 m-4">
        <h4 className="W-50">Customer</h4>
        <AsyncSelect
          className="w-75"
          cacheOptions
          placeholder="Choose customer"
          components={makeAnimated()}
          getOptionLabel={(e) =>
            e.customer_id +
            " | " +
            e.customer_name +
            " | " +
            e.customer_address +
            " | " +
            e.customer_contact_number
          }
          getOptionValue={(e) => e.id}
          loadOptions={handleSearch}
          onChange={(value) => setCustomerDetails(value)}
        />
        <Button onClick={() => setAddNewCustomer(!addNewCustomer)}>
          New Customer
        </Button>
      </div>
      {addNewCustomer && (
        <AddCustomerForm
          showModal={{}}
          handleClose={() => setAddNewCustomer(false)}
          handleSave={() => {}}
        />
      )}
      <div key={`inline`} className="m-3 ">
        <Form.Check
          inline
          label="Purchase"
          name="group1"
          type="radio"
          id={`inline-1`}
        />
        <Form.Check
          inline
          label="Sale"
          name="group1"
          type="radio"
          id={`inline-2`}
        />
        <Form.Check
          inline
          name="group1"
          label="Sales Returned"
          type="radio"
          id={`inline-3`}
        />
      </div>
    </Modal>
  );
};

export default AddInvoice;
