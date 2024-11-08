import type * as GlobalTypes from './global.types';

export interface OrderUser {
    /** Name of user - both first and last */
    name?: string;
    /** Email of user */
    email?: string;
    /** Phone of user */
    phone?: string;
    /** Country - two letter code */
    country?: string;
    /** City */
    city?: string;
    /** Street */
    street?: string;
    /** Zip */
    zip?: string;
}

export interface OrderItem {
    /** Product */
    product: {id: string, name: string | Record<string, string>, sku: string, thumbnail: GlobalTypes.AssetInteface};
    /** Quantity of items */
    quantity: number;
    /** Price of product - per item */
    price: number;
    /** Regular price of product - per item */
    regularPrice?: number;
    /** VAT rate of product */
    vatRate?: number;
    /** Sale units of product */
    salesUnit?: GlobalTypes.SaleUnitsEnum;
}

export interface Order {
    /** Order id. Use instead of id. */
    _id: string;
    /** Order id. Use _id instead */
    id: string;
    /** Order number */
    orderNumber: string;
    /** Billing data */
    billingData: OrderUser;
    /** Shipping data */
    shippingData: OrderUser;
    /** Array of order items */
    items: OrderItem[];
    /** Platform from which the order is */
    platform?: string;
    /** Status of order */
    status: 'pending' | 'completed' | 'cancelled';
    /** Subtotal on order */
    subtotal?: number;
    /** Shipping cost */
    shippingCost?: number;
    /** Total cost of order */
    total: number;
    /** Referrence for the item */
    reference?: string;
    /** Created at datetime string */
    createdAt: string;
    /** Updated at datetime string */
    updatedAt: string;
}

export interface OrderInputData {
    /** Billing data */
    billingData: OrderUser;
    /** Shipping data */
    shippingData: OrderUser;
    /** Note from user */
    note?: string;
}

export interface OrderData {
    /** Order object */
    order: OrderInputData;
    /** Success url - where user will be redirected if payment is OK. orderId query param will be attached to the url so don't add that query param yourself. This param will hold id of order that can be then extracted from query and used to call checkOrderPaymentStatus if payment method is one of the online methods */
    successUrl: string;
    /** Failed url - where user will be redirected if payment is NOT ok. orderId query param will be attached to the url so don't add that query param yourself. This param will hold id of order that can be then extracted from query and used to call checkOrderPaymentStatus if payment method is one of the online methods */
    failedUrl: string;
    /** Selected payment method - one of the available keys to select payment method. Usually one of: cash, stripe, paypal, klarna */
    paymentMethod: string;
    /** Selected shipping provider - one of the available keys to select as shipping provider for the order. Make sure to check that shippingData.country is available for selected shipping provider */
    shippingProvider: string;
}