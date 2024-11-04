import type { DefaultQueryParams } from "./global.types";


export interface ProductsQueryParams extends DefaultQueryParams {
	/** Whether to calculate prices only for single quantity. If true - product object will have fields: price, regularPrice, fromQuantity, vatRate, and salesUnit. If not true or not passed - product object will have prices property with array of prices config (each of which has those fields) */
	onlySingleQuantity?: boolean;
}

export interface Product {
	/** Id of product. Use instead of id. */
	_id: string;
	/** Id of product. Use _id instead */
	id: string;
	/** SKU of product */
	sku: string;
	/** Name of product. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Ean code for product */
	eanCode?: string;
	/** Is product active */
	isActive: boolean;
	/** Should product be visible in search (or in other places as a product card) */
	isInSearch: boolean;
	/** Brand of product if any */
	brand?: null | {id: string; name: string | Record<string, string>};
	/** Brand model of product if any */
	brandModel?: null | {id: string; name: string | Record<string, string>};
}