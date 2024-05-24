import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import { debounce } from "../Utils/utils";
import axios from "axios";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { AddCustomerForm } from "../Customers/AddCustomerModal";
import { useNavigate } from "react-router-dom";

const AddInvoice = ({ handleClose }) => {
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [addNewCustomer, setAddNewCustomer] = useState(false);
  const [transactionType, setTransactionType] = useState("sales");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (requestBody) => {
    try {
      const response = (
        await axios.post(
          `${apiURL}/api/customers`,
          requestBody,
          getHeaderOptions(token)
        )
      ).data;
      console.log("Response", response);
      setSelectedCustomer(response);
      setAddNewCustomer(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleProceed = () => {
    handleClose();
    navigate(
      `/invoices/${selectedCustomer.id}/new?transactionType=${transactionType}`
    );
  };

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
        await axios.get(`${apiURL}/api/customers`, {
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
          value={selectedCustomer}
          onChange={(value) => {
            setAddNewCustomer(false);
            setSelectedCustomer(value);
          }}
        />
        <Button
          className="d-flex justify-content-center"
          onClick={() => setAddNewCustomer(!addNewCustomer)}
        >
          <div>New Customer</div>
          <box-icon
            type="solid"
            color="white"
            name={addNewCustomer ? "chevron-up" : "chevron-down"}
          ></box-icon>
        </Button>
      </div>
      {addNewCustomer && (
        <Card className="m-2">
          <AddCustomerForm
            showModal={{}}
            handleClose={() => setAddNewCustomer(false)}
            handleSave={handleSave}
          />
        </Card>
      )}
      <div key={`inline`} className="m-3">
        <Form.Check
          inline
          label="Sale"
          name="transaction_type"
          type="radio"
          defaultChecked
          onChange={(value) => setTransactionType("sales")}
        />
        <Form.Check
          inline
          label="Purchase"
          name="transaction_type"
          type="radio"
          onChange={(value) => setTransactionType("purchase")}
        />
        <Form.Check
          inline
          name="transaction_type"
          label="Sales Returned"
          type="radio"
          onChange={(value) => setTransactionType("sales returned")}
        />
      </div>
      <div className="d-flex justify-content-end gap-4 m-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel Invoice
        </Button>
        <Button
          onClick={handleProceed}
          type="submit"
          disabled={!transactionType || !selectedCustomer}
        >
          Proceed
        </Button>
      </div>
    </Modal>
  );
};

export default AddInvoice;
