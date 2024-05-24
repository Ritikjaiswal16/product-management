import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../Table/CustomTable";
import axios from "axios";
import AddInventoryModal from "./AddInventoryModal";
import { useAuth } from "../Routes/AuthProvider";
import { apiURL, getHeaderOptions } from "../Utils/AxiosUtils";
import { DeleteModal, Toaster } from "../Components";
import { debounce } from "../Utils/utils";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

const Inventory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [toastInfo, setToastInfo] = useState(null);
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const { token } = useAuth();
  const navigate = useNavigate();

  const setPagination = (number = 1) => {
    getInventory(number);
    setPageNumber(number);
  };

  const inventoryHeader = Object.freeze([
    {
      name: "Product Name",
      accessorKey: "product_name",
    },
    {
      name: "Product Manufacturer",
      accessorKey: "product_manufacturer",
    },
    {
      name: "Batch Number",
      accessorKey: "batch_number",
    },
    {
      name: "Expiry Date",
      accessorKey: "expiry_date",
    },
    {
      name: "Stock",
      accessorKey: "stock",
    },
    {
      name: "Net Quantity",
      accessorKey: "product_net_quantity",
    },
  ]);

  const handleSearch = useCallback(
    debounce((value) => getInventory(1, value)),
    []
  );

  const handleSave = async (requestBody) => {
    try {
      setIsLoading(true);
      console.log("requestBody", requestBody);
      let response;
      if (Object.keys(showAddInventoryModal).length) {
        response = (
          await axios.put(
            `${apiURL}/api/inventory/${showAddInventoryModal.inventory_id}`,
            requestBody,
            getHeaderOptions(token)
          )
        ).data;
        setToastInfo({
          type: "success",
          message: "Inventory updated successfully.",
        });
      } else {
        response = (
          await axios.post(
            `${apiURL}/api/inventory`,
            requestBody,
            getHeaderOptions(token)
          )
        ).data;
        setToastInfo({
          type: "success",
          message: "Inventory Added successfully.",
        });
      }
      console.log("Response", response);
      setPagination(1);
      setShowAddInventoryModal(null);
    } catch (error) {
      console.log("error", error);
      setToastInfo({ type: "error", message: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInventory = async (inventoryId) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${apiURL}/api/inventory/${inventoryId}`,
        getHeaderOptions(token)
      );
      setPagination(1);
      setShowDeleteModal(null);
      setToastInfo({
        type: "success",
        message: "Inventory Deleted successfully.",
      });
    } catch (error) {
      console.log("error", error);
      setToastInfo({ type: "error", message: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const getInventory = useCallback(async (pageNumber, searchText) => {
    try {
      setIsLoading(true);
      const response = (
        await axios.get(`${apiURL}/api/inventory`, {
          params: { page: pageNumber || 1, search: searchText },
          ...getHeaderOptions(token),
        })
      ).data;
      console.log("Response", response);
      setInventoryDetails(response);
    } catch (error) {
      console.log("error", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getInventory();
  }, []);

  const dropdownOptions = [
    {
      name: "Edit",
      onClick: (values) => navigate(`/inventory/${values.product}`),
    },
    {
      name: "Delete",
      onClick: setShowDeleteModal,
      className: "delete-button",
    },
  ];

  return (
    <div className="inventory-page">
      {toastInfo && (
        <Toaster
          variant={toastInfo.type}
          toastMessage={toastInfo.message}
          onClose={() => setToastInfo(null)}
        />
      )}
      {showAddInventoryModal && (
        <AddInventoryModal
          showModal={showAddInventoryModal}
          setShowModal={setShowAddInventoryModal}
          handleSave={handleSave}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          title={`Delete "${showDeleteModal.inventory_name}" ?`}
          message={
            "Are you sure want to delete inventory?\n Inventory will be deleted permanently."
          }
          handleCancel={() => setShowDeleteModal(null)}
          handleDelete={() =>
            handleDeleteInventory(showDeleteModal.inventory_id)
          }
        />
      )}
      <CustomTable
        className={"inventory-table"}
        isLoading={isLoading}
        isError={isError}
        title={"Inventory"}
        headers={inventoryHeader}
        records={inventoryDetails?.results}
        totalRecords={inventoryDetails?.count}
        dropdownOptions={dropdownOptions}
        pageNumber={pageNumber}
        setPageNumber={setPagination}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default Inventory;
