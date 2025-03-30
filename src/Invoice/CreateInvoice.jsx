import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { SpinnerOverlay } from "../Components";
import DetailsAccordions from "../Components/DetailsAccordions";
import CustomTable from "../Table/CustomTable";
import { debounce } from "../Utils/utils";
import { useAuth } from "../Routes/AuthProvider";
import axios from "axios";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import moment from "moment";
import AddProductToCart from "./AddProductToCart";
import Table from 'react-bootstrap/Table';
import "./Invoice.css";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const CreateInvoice = () => {
  const [searchParams, _] = useSearchParams();
  const { customerId } = useParams();
  const { token } = useAuth();
  const [customerData, setCustomerData] = useState({});
  const [customerDetail, setCustomerDetail] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState();
  const [isTableLoading, setIsTableLoading] = useState();
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const navigate = useNavigate();
  console.log(
    "customer di and type",
    customerId,
    searchParams.get("transactionType")
  );
  const setPagination = (number = 1) => {
    getCustomerHistory(number);
    setPageNumber(number);
  };

  const getCustomer = async () => {
    try {
      setIsLoading(true);
      const response = (
        await axios.get(
          `${apiURL}/customers/${customerId}`,
          getHeaderOptions(token)
        )
      ).data;
      setCustomerData(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const customerHistoryHeader = Object.freeze([
    {
      name: "Date",
      accessorKey: "date",
      onClick: (value) => {
        let testDateUtc = moment.utc(value.date).local();
        return testDateUtc.format("DD/MM/YYYY, hh:mm A");
      },
    },
    {
      name: "Payment Type",
      accessorKey: "payment_type",
    },
    {
      name: "Description",
      accessorKey: "description",
    },
    {
      name: "Change Type",
      accessorKey: "get_change_type_display",
    },
    {
      name: "Amount Type",
      accessorKey: "get_amount_type_display",
    },
    {
      name: "Amount",
      accessorKey: "amount",
    },
  ]);

  const handleSave = async (requestBody) => {
    try {
      setIsLoading(true);
      console.log("requestBody", requestBody);
      const response = (
        await axios.put(
          `${apiURL}/customers/${requestBody.id}`,
          requestBody,
          getHeaderOptions(token)
        )
      ).data;
      // setToastInfo({type:"success", message:"Customer Added successfully."});
      console.log("Response", response);
      setCustomerData((prev) => ({ ...prev, ...response }));
    } catch (error) {
      console.log("error", error);
      // setToastInfo({type:"error", message:"Something went wrong."});
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (requestBody) => {
    try {
      setIsTableLoading(true);
      console.log("requestBody", requestBody);
      let body = { ...requestBody };
      if (body.get_change_type_display !== "Deposit") {
        body["payment_type"] = null;
      }
      const response = (
        await axios.post(
          `${apiURL}/booklog/${customerData.id}`,
          body,
          getHeaderOptions(token)
        )
      ).data;
      // setToastInfo({type:"success", message:"Customer Added successfully."});
      console.log("Response", response);
      getCustomerHistory();
      setShowHistoryModal(false);
    } catch (error) {
      console.log("error", error);
      // setToastInfo({type:"error", message:"Something went wrong."});
    } finally {
      setIsTableLoading(false);
    }
  };

  const getCustomerHistory = useCallback(async (pageNumber, searchText) => {
    try {
      setIsTableLoading(true);
      const response = (
        await axios.get(`${apiURL}/api/booklog/${customerId}`, {
          params: { page: pageNumber || 1, search: searchText },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      setCustomerDetail(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsTableLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    debounce((value) => getCustomerHistory(1, value)),
    []
  );

  useEffect(() => {
    getCustomer();
  }, []);

  return (


    <div className="invoice-main">
      {isLoading && <SpinnerOverlay />}
      {Object.keys(customerData)?.length ? (
        <div>
          < div className="details-back-btn" style={{ display: "flex", alignItems: "center" }} onClick={() => navigate("/invoices")}>
            <box-icon size="md" name="chevron-left"></box-icon> <h5>Create Invoice
            </h5>
          </div>
          <center> <h4>
            Sales Invoice
          </h4></center>
          {/* <div className="table-responsive-sm">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td className="fw-bolder pb-0">Bill To</td>
                  <td className="fw-bolder pb-0">Address</td>
                </tr>
                <tr>
                  <td className="pt-0">
                    Name : {customerData.name}( {customerData.registration_id} ) <br />
                    GSTIN : {customerData.gst} <br />
                    PH No.: {customerData.contact_number} 
                    </td>
                    <td>
                    <p style={{whiteSpace:"pre-line"}}>{customerData.address}</p>


                  </td>


                </tr>
              </tbody>
            </table>
          </div> */}
          <div class="table-responsive-sm">
            <table class="table table-borderless">
              <tbody>
                <tr>
                  <td class="fw-bolder pb-0">Name</td>
                  <td class="fw-bolder pb-0">Id</td>
                  <td class="fw-bolder pb-0"> GST Number</td>
                  <td class="fw-bolder pb-0">Current Balance</td>
                </tr>
                <tr>

                  <td class="pt-0"> {customerData.name} </td>
                  <td class="pt-0"> {customerData.registration_id}</td>
                  <td class="pt-0">{customerData.gst}</td>
                  <td class="pt-0">{customerData.balance} </td>
                </tr>
                <tr>
                  <td class="fw-bolder pb-0 pt-3">Email</td>
                  <td class="fw-bolder pb-0 pt-3"> Contact Number </td>
                  <td class="fw-bolder pb-0 pt-3" colspan="2"> Adddress</td>
                </tr>
                <tr>
                  <td class="py-0">
                    {customerData.email}
                  </td>
                  <td class="py-0">{customerData.contact_number}</td>
                  <td class="py-0" colspan="2">{customerData.address}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {showHistoryModal && (
            <AddProductToCart handleClose={() => setShowHistoryModal(null)} />
          )}




          <div className="top-div">
            {isLoading && <SpinnerOverlay />}

            {showHistoryModal && (
              <AddProductToCart handleClose={() => setShowHistoryModal(null)} />
            )}
            <CustomTable
              className={""}
              isLoading={isTableLoading}
              title={"Items"}
              headers={customerHistoryHeader}
              records={customerDetail?.results}
              totalRecords={customerDetail?.count}
              primaryBtnHeader={"Add"}
              primaryBtnHandler={() => setShowHistoryModal(true)}
              pageNumber={pageNumber}
              setPageNumber={setPagination}
              handleSearch={handleSearch}
            />
          </div>



          <div className="invoice-footer">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="lable">Amount ⟨₹⟩</InputGroup.Text>
              <Form.Control id="value" type="number" readOnly placeholder="0.0" />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="lable">Paid Amount ⟨₹⟩</InputGroup.Text>
              <Form.Control id="value" type="number" placeholder="0.0" />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="lable">Invoice Total ⟨₹⟩</InputGroup.Text>
              <Form.Control id="value" type="number" readOnly placeholder="0.0" />
            </InputGroup>
          </div>
        </div>
      ) : null}



    </div >
  );
};

export default CreateInvoice;
