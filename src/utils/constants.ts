export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}

export const ResponseCodes = {
    // Location response codes
    LOCATION_CREATED: { code: 1001, message: "Location created successfully" },
    LOCATION_LIST: { code: 1002, message: "Location list fetched successfully" },
    LOCATION_DETAILS: { code: 1003, message: "Location details fetched successfully" },
    LOCATION_UPDATED: { code: 1004, message: "Location updated successfully" },
    LOCATION_DELETED: { code: 1005, message: "Location deleted successfully" },

    // Building response codes
    BUILDING_CREATED: { code: 2001, message: "Building created successfully" },
    BUILDING_LIST: { code: 2002, message: "Building list fetched successfully" },
    BUILDING_DETAILS: { code: 2003, message: "Building details fetched successfully" },
    BUILDING_UPDATED: { code: 2004, message: "Building updated successfully" },
    BUILDING_DELETED: { code: 2005, message: "Building deleted successfully" },

    // Sub Building response codes
    SUB_BUILDING_CREATED: { code: 3001, message: "Sub Building created successfully" },
    SUB_BUILDING_LIST: { code: 3002, message: "Sub Building list fetched successfully" },
    SUB_BUILDING_DETAILS: { code: 3003, message: "Sub Building details fetched successfully" },
    SUB_BUILDING_UPDATED: { code: 3004, message: "Sub Building updated successfully" },
    SUB_BUILDING_DELETED: { code: 3005, message: "Sub Building deleted successfully" },

    // Service response codes
    SERVICE_CREATED: { code: 4001, message: "Service created successfully" },
    SERVICE_LIST: { code: 4002, message: "Service list fetched successfully" },
    SERVICE_DETAILS: { code: 4003, message: "Service details fetched successfully" },
    SERVICE_UPDATED: { code: 4004, message: "Service updated successfully" },
    SERVICE_DELETED: { code: 4005, message: "Service deleted successfully" },

    // Sub Service response codes
    SUB_SERVICE_CREATED: { code: 5001, message: "Sub Service created successfully" },
    SUB_SERVICE_LIST: { code: 5002, message: "Sub Service list fetched successfully" },
    SUB_SERVICE_DETAILS: { code: 5003, message: "Sub Service details fetched successfully" },
    SUB_SERVICE_UPDATED: { code: 5004, message: "Sub Service updated successfully" },
    SUB_SERVICE_DELETED: { code: 5005, message: "Sub Service deleted successfully" },

    // Product response codes
    PRODUCT_CREATED: { code: 6001, message: "Product created successfully" },
    PRODUCT_LIST: { code: 6002, message: "Product list fetched successfully" },
    PRODUCT_DETAILS: { code: 6003, message: "Product details fetched successfully" },
    PRODUCT_UPDATED: { code: 6004, message: "Product updated successfully" },
    PRODUCT_DELETED: { code: 6005, message: "Product deleted successfully" },
}
