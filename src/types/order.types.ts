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