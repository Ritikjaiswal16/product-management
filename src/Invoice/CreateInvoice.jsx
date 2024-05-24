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
          `${apiURL}/api/customers/${customerId}`,
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
          `${apiURL}/api/customers/${requestBody.id}`,
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
          `${apiURL}/api/booklog/${customerData.id}`,
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
    <div className="top-div">
      {isLoading && <SpinnerOverlay />}
      {Object.keys(customerData)?.length ? (
        <div>
          <DetailsAccordions
            backButton={
              <div
                className="details-back-btn"
                onClick={() => navigate("/invoices")}
              >
                <box-icon size="md" name="chevron-left"></box-icon>
              </div>
            }
            title={
              <div className="d-flex align-center gap-1">
                <h4 className="pt-1">{customerData.customer_name}</h4>
              </div>
            }
            // rightButton={
            //   <div className="d-flex gap-4">
            //     {
            //       <>
            //         <Button
            //           className="customer-edit rounded-3"
            //           onClick={() => handleSubmit()}
            //           disabled={!isValid || !dirty}
            //         >
            //           Save
            //         </Button>
            //       </>
            //     }
            //   </div>
            // }
            body={
              <div class="table-responsive-sm">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <td class="fw-bolder pb-0">Id</td>
                      <td class="fw-bolder pb-0">Balance</td>
                      <td class="fw-bolder pb-0"> GST Number</td>
                      <td class="fw-bolder pb-0">Is Active</td>
                    </tr>
                    <tr>
                      <td class="pt-0"> {customerData.customer_id}</td>
                      <td class="pt-0">{customerData.customer_balance}</td>
                      <td class="pt-0">{customerData.customer_gst}</td>
                      <td class="pt-0">
                        <a>
                          {customerData.customer_is_active
                            ? "Active"
                            : "Disabled"}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td class="fw-bolder pb-0 pt-3">Email</td>
                      <td class="fw-bolder pb-0 pt-3">Contact Number</td>
                      <td class="fw-bolder pb-0 pt-3" colspan="2">
                        Adddress
                      </td>
                    </tr>
                    <tr>
                      <td class="py-0">
                        <a>{customerData.customer_email}</a>
                      </td>
                      <td class="py-0">
                        <a>{customerData.customer_contact_number}</a>
                      </td>
                      <td class="py-0" colspan="2">
                        {" "}
                        <a>{customerData.customer_address}</a>
                      </td>
                    </tr>
                  </tbody>{" "}
                </table>
              </div>
            }
          ></DetailsAccordions>
        </div>
      ) : null}
      {showHistoryModal && (
        <AddProductToCart handleClose={() => setShowHistoryModal(null)} />
      )}
      <CustomTable
        className={"history-table"}
        isLoading={isTableLoading}
        title={"Customer History"}
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
  );
};

export default CreateInvoice;
