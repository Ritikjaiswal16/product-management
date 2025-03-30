import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import SpinnerOverlay from "../Components/SpinnerOverlay";
import axios from "axios";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import { useAuth } from "../Routes/AuthProvider";
import CustomTable from "../Table/CustomTable";
import { debounce } from "../Utils/utils";
import moment from "moment";
import "./Inventory.css";
import "../DetailsView.css";
import { Formik } from "formik";
import DetailsAccordions from "../Components/DetailsAccordions";
import "boxicons";

const InventoryDetails = () => {
  const { inventoryId } = useParams();
  const { token } = useAuth();
  const [inventoryData, setInventoryData] = useState({});
  const [inventoryDetail, setInventoryDetail] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState();
  const [isTableLoading, setIsTableLoading] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const setPagination = (number = 1) => {
    getInventoryHistory(number);
    setPageNumber(number);
  };

  const validateInventory = (values) => {
    let errors = {};
    if (!values.sp_credit) {
      errors.sp_credit = "Please provide credit price";
    }
    if (!values.gst_percentage) {
      errors.gst_percentage = "Please provide GST number";
    }
    if (!values.sp_gst) {
      errors.sp_gst =
        "Please provide estimated selling price including GST";
    }
    if (!values.notify_count) {
      errors.notify_count =
        "Please provide notify count to remind when reach that value";
    }
    return errors;
  };

  const getInventory = async () => {
    try {
      setIsLoading(true);
      const response = (
        await axios.get(
          `${apiURL}/inventory/${inventoryId}`,
          getHeaderOptions(token)
        )
      ).data;
      setInventoryData(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const inventoryHistoryHeader = Object.freeze([
    {
      name: "Purchased From",
      accessorKey: "customer_name",
    },
    {
      name: "Cost Price",
      accessorKey: "price",
    },
    {
      name: "Quantity",
      accessorKey: "quantity",
      onClick: (value) => {
        if(value.invoice_type=="Sales Return" || value.invoice_type=="Purchase") 
          return ( <span style={{color:"green"}}>+ {value.quantity} </span>)
        else
          return ( <span style={{color:"red"}}>-  &nbsp;{value.quantity} </span>)
      },
    },
    {
      name: "Type",                                                                       
      accessorKey: "invoice_type",
    },
    {
      name: "Expiry Date",
      accessorKey: "expiry_date",
      onClick: (value) => {
        let testDateUtc = moment.utc(value.expiry_date).local();
        return testDateUtc.format("DD/MM/YYYY");
      },
    },
    {
      name: "Transaction Date",
      accessorKey: "date",
      onClick: (value) => {
        let testDateUtc = moment.utc(value.date).local();
        return testDateUtc.format("DD/MM/YYYY, hh:mm A");
      },
    },
  ]);

  const handleSave = async (requestBody) => {
    const body = {
      ...requestBody,
      notify_count: requestBody.notify_count,
      gst_percentage: requestBody.gst_percentage,
      sp_gst: requestBody.sp_gst,
      sp_credit: requestBody.sp_credit,
    };
    try {
      setIsLoading(true);
      console.log("requestBody", requestBody);
      const response = (
        await axios.put(
          `${apiURL}/inventory/${requestBody.id}`,
          body,
          getHeaderOptions(token)
        )
      ).data;
      // setToastInfo({type:"success", message:"Inventory Added successfully."});
      console.log("Response", response);
      setInventoryData((prev) => ({ ...prev, ...response }));
      setIsEditing(false);
    } catch (error) {
      console.log("error", error);
      // setToastInfo({type:"error", message:"Something went wrong."});
    } finally {
      setIsLoading(false);
    }
  };

  const getInventoryHistory = useCallback(async (pageNumber, searchText) => {
    try {
      setIsTableLoading(true);
      const response = (
        await axios.get(`${apiURL}/invenotrylogs/inventory/${inventoryId}`, {
          params: { page: pageNumber || 1, search: searchText },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      setInventoryDetail(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsTableLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    debounce((value) => getInventoryHistory(1, value)),
    []
  );

  useEffect(() => {
    getInventory();
    getInventoryHistory();
  }, []);

  return (
    <div className="top-div">
      {isLoading && <SpinnerOverlay />}
      {Object.keys(inventoryData)?.length ? (
        <div>
          <Formik
            initialValues={inventoryData}
            validate={validateInventory}
            onSubmit={handleSave}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
              dirty,
            }) => (
              <>
                <Form noValidate onSubmit={handleSubmit}>
                  <DetailsAccordions
                    backButton={
                      <div
                        className="details-back-btn"
                        onClick={() => navigate("/inventory")}
                      >
                        <box-icon size="md" name="chevron-left"></box-icon>
                      </div>
                    }
                    title={
                      <Form.Group className="d-flex align-center gap-1">
                        <h4 className="pt-1">{inventoryData.product_name}</h4>
                      </Form.Group>
                    }
                    body={
                      <div class="table-responsive-sm">
                        <table class="table table-borderless">
                          <tbody>
                            <tr>
                              <td class="fw-bolder pb-0">Manufacturer</td>
                              <td class="fw-bolder pb-0">Batch Number</td>
                              <td class="fw-bolder pb-0"> Net Quantity</td>
                              <td class="fw-bolder pb-0">Available Unit</td>
                            </tr>
                            <tr>
                              <td class="pt-0">
                                {inventoryData.product_manufacturer}
                              </td>
                              <td class="pt-0">{inventoryData.batch_number}</td>
                              <td class="pt-0">
                                {inventoryData.product_net_quantity +
                                  " " +
                                  inventoryData.product_measure_unit}
                              </td>
                              <td class="pt-0">
                                {inventoryData.quantity}
                              </td>
                            </tr>
                            <tr>
                              <td class="fw-bolder pb-0 pt-3">Selling Price</td>
                              <td class="fw-bolder pb-0 pt-3">Avg Bill Price</td>
                              <td class="fw-bolder pb-0 pt-3">Expiry Date</td>
                              <td class="fw-bolder pb-0 pt-3">Product Details</td>
                            </tr>
                            <tr>
                              <td class="py-0">
                             {inventoryData.product_sp_gst}
                              </td>
                              <td class="py-0">
                              {inventoryData.price}
                              </td>
                              <td class="py-0">
                              {inventoryData.expiry_date}
                              </td>
                              <td class="py-0">
                              <Link
                              className=" rounded-3"
                              onClick={() => navigate("/products/"+inventoryData.product)}
                            >
                              View
                            </Link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    }
                  ></DetailsAccordions>
                </Form>
              </>
            )}
          </Formik>
        </div>
      ) : null}
      <CustomTable
        className={"history-table"}
        isLoading={isTableLoading}
        title={"Change Log"}
        headers={inventoryHistoryHeader}
        records={inventoryDetail?.results}
        totalRecords={inventoryDetail?.count}
        pageNumber={pageNumber}
        setPageNumber={setPagination}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default InventoryDetails;
