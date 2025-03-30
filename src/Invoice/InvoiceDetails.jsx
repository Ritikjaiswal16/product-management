import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Routes/AuthProvider";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import { useNavigate, useParams } from "react-router-dom";
import "./Invoice.css";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { SpinnerOverlay } from "../Components";
import { Card } from "react-bootstrap";

const Invoices = () => {
    const { invoiceId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();
    const [invoiceDetails, setInvoiceDetails] = useState([]);


    const getInvoiceDetails = async () => {
        try {
            setIsLoading(true);
            const response = (
                await axios.get(
                    `${apiURL}/invoices/${invoiceId}`,
                    getHeaderOptions(token)
                )
            ).data;
            setInvoiceDetails(response);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        getInvoiceDetails();
    }, []);


    return (
        <div className="invoice-details" >


            {isLoading && <SpinnerOverlay />}

            <div>
                < div className="details-back-btn" style={{ display: "flex", alignItems: "center" }} onClick={() => navigate("/invoices")}>
                    <box-icon size="md" name="chevron-left"></box-icon> <h5>
                    </h5>
                </div>
                <center> <h4>
                    {invoiceDetails.type} Invoice
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
                    Name : {invoiceDetails.customer?.name}( {invoiceDetails.customer?.registration_id} ) <br />
                    GSTIN : {invoiceDetails.customer?.gst} <br />
                    PH No.: {invoiceDetails.customer?.contact_number} 
                    </td>
                    <td>
                    <p style={{whiteSpace:"pre-line"}}>{invoiceDetails.customer?.address}</p>


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

                                <td class="pt-0"> {invoiceDetails.customer?.name} </td>
                                <td class="pt-0"> {invoiceDetails.customer?.registration_id}</td>
                                <td class="pt-0">{invoiceDetails.customer?.gst}</td>
                                <td class="pt-0">{invoiceDetails.customer?.balance} </td>
                            </tr>
                            <tr>
                                <td class="fw-bolder pb-0 pt-3">Email</td>
                                <td class="fw-bolder pb-0 pt-3"> Contact Number </td>
                                <td class="fw-bolder pb-0 pt-3" colspan="2"> Adddress</td>
                            </tr>
                            <tr>
                                <td class="py-0">
                                    {invoiceDetails.customer?.email}
                                </td>
                                <td class="py-0">{invoiceDetails.customer?.contact_number}</td>
                                <td class="py-0" colspan="2">{invoiceDetails.customer?.address}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <Table hover className="invoice-item" size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Batch No</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceDetails?.items?.map((record, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{record.product_name + " - " + record.product_net_quantity + " " + record.product_measure_unit}</td>
                                <td>{record.batch_number}</td>
                                <td>{record.quantity}</td>
                                <td>{record.price}</td>
                                <td>{record.amount}</td>
                            </tr>
                        ))}

                    </tbody>
                </Table>




                <div className="invoice-footer">
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Text id="lable">Amount ⟨₹⟩</InputGroup.Text>
                        <Form.Control id="value" type="number" readOnly placeholder={invoiceDetails.total_amount} />
                    </InputGroup>
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Text id="lable">Paid Amount ⟨₹⟩</InputGroup.Text>
                        <Form.Control id="value" type="number" placeholder={invoiceDetails.partial_paid} />
                    </InputGroup>
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Text id="lable">Invoice Total ⟨₹⟩</InputGroup.Text>
                        <Form.Control id="value" type="number" readOnly placeholder={invoiceDetails.total_amount} />
                    </InputGroup>
                </div>
            </div>

        </div>
    );
};

export default Invoices;
