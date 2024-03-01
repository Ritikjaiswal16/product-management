import React from "react";
import "boxicons";
import CustomTable from "./Table/CustomTable";
import { headersOfExpiryTable, metadataOfExpiryTable, outOfStockMetadata, outofStockHeader } from "./Utils/TableUtils";
import { outofStockTableRecords, recordsOfExpiryTable } from "./MockData";

const Dashboard = () => {
    
    return(
        <div className="d-flex flex-column w-100">
            <CustomTable 
                tableMetadata={metadataOfExpiryTable} 
                headers={headersOfExpiryTable} 
                records={recordsOfExpiryTable}
                doesHaveAction={false}
            />
            <hr/>
            <CustomTable 
                tableMetadata={outOfStockMetadata} 
                headers={outofStockHeader} 
                records={outofStockTableRecords}
                doesHaveAction={false}
            />
    </div>
    )
}

export default Dashboard;