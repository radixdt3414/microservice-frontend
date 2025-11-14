export const API = {
    CATALOG: {
        CRUD: "http://localhost:6005/catalog/product",
        LIST: "http://localhost:6005/catalog/products"
    },
    DISCOUNT:{
        CRUD: "grpc://localhost:5002/"
    },
    INVENTORY: {
        CRUD: "http://localhost:6005/inventory/warehouse"
    },
    CART:{
        CRUD: "http://localhost:6005/cart/basket",
        CHECKOUT: "http://localhost:6005/cart/basket/checkout"
    },
    ORDER:{
        CRUD: "http://localhost:6005/purchase/order",
        GET_BY_CUSTOMER_ID: "http://localhost:6005/purchase/order/Customer"
    },
    AUTH:{
        LOGIN: "http://localhost:6005/auth/login",
        SIGNUP: "http://localhost:6005/auth/signup"
    }
}