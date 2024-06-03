export const metadataOfExpiryTable = Object.freeze({
    totalRecords: 100,
    title: "Products to near expiry"
})

export const outOfStockMetadata = Object.freeze({
    totalRecords: 100,
    title: "Products near out of stock"
})

export const headersOfExpiryTable = Object.freeze([
    {
        name: "Product Id",
        accessorKey: 'id',
    },
    {
        name: "Product Name",
        accessorKey: 'name',
    },
    {
        name: "Quantity",
        accessorKey: 'quantity',
    },
    {
        name: "Expiry",
        accessorKey: 'expiry',
    }
])

export const outofStockHeader = Object.freeze([
    {
        name: "Product Id",
        accessorKey: 'id',
    },
    {
        name: "Product Name",
        accessorKey: 'name',
    },
    {
        name: "Quantity",
        accessorKey: 'quantity',
    }
])

export const customerHeader = Object.freeze([
    {
        name: "Id",
        accessorKey: 'customer_id',
    },
    {
        name: "Name",
        accessorKey: 'customer_name',
    },
    {
        name: "Address",
        accessorKey: 'customer_address'
    },
    {
        name: "GST Number",
        accessorKey: 'customer_gst',
    },
    {
        name: "Email",
        accessorKey: 'customer_email',
    },
    {
        name: "Contact Number",
        accessorKey: 'customer_contact_number',
    },
    {
        name: "Balance",
        accessorKey: 'customer_balance',
    },
    {
        name: "Status",
        accessorKey: 'customer_is_active',
        onClick: (record) => {
            return(record.customer_is_active? "Active" :"Disabled")
        }
    }
])





