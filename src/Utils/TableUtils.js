export const metadataOfExpiryTable = Object.freeze({
    totalRecords: 100,
    title: "Products to near expiry"
})

export const outOfStockMetadata = Object.freeze({
    totalRecords: 100,
    title: "Products near out of stock"
})

export const productsMetadata = Object.freeze({
    totalRecords: 100,
    title: "Products"
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

export const productHeader = Object.freeze([
    {
        name: "Product Name",
        accessorKey: 'product_name',
    },
    {
        name: "Product Manufacturer",
        accessorKey: 'product_manufacturer'
    },
    {
        name: "HSN Code",
        accessorKey: 'product_hsn',
    },
    {
        name: "Net Quantity",
        accessorKey: 'product_net_quantity',
    },
    {
        name: "Measure Unit",
        accessorKey: 'product_measure_unit',
    },
    {
        name: "GST %",
        accessorKey: 'product_gst_percentage',
    },
    {
        name: "Selling Price",
        accessorKey: 'product_sp_gst',
    },
    {
        name: "Notify Count",
        accessorKey: 'product_notify_count',
    }
])