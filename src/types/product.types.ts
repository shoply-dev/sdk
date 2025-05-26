import type * as GlobalTypes from "./global.types";

export type ProductOmitFieldsEnum =
	| 'isActive'
	| 'isInSearch'
	| 'eanCode'
	| 'mainSalesUnit'
	| 'brand'
	| 'brandModel'
	| 'shortDescription'
	| 'description'
	| 'categories'
	| 'assets'
	| 'images'
	| 'images360'
	| 'attributes'
	| 'shipping'
	| 'createdAt'
	| 'updatedAt'
	| 'seo'
	| 'relations'
	| 'variations'
	| 'variationAttributes'
	| 'addOnProducts'
	| 'vatRate'
	| 'fromQuantity'
	| 'salesUnit'
	| 'condition'
	| 'warehouses'
	| 'ribbon';

export type SpecialProductTypesEnum = 'featured' | 'sale' | 'new';

export interface ProductsQueryParams extends GlobalTypes.DefaultQueryParams {
	/** Whether to calculate prices only for single quantity. If true - product object will have fields: price, regularPrice, fromQuantity, vatRate, and salesUnit. If not true or not passed - product object will have prices property with array of prices config (each of which has those fields) */
	onlySingleQuantity?: boolean;
	/** Allowed sort fields */
	sortField?: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'sku' | 'price';
	/** Category breadcrumb */
	category?: string | string[];
	/** Brand id */
	brand?: string | string[];
	/** Brand model id */
	brandModel?: string | string[];
	/** Attributes object - for key use attribute key. If you need to use $lte or $gte - add -min or -max to key name without spaces!*/
	attributes?: Record<string, any>;
	/** Fields to omit from return */
	omitFields?: ProductOmitFieldsEnum[] | '*';
	/** Price of products. */
	price?: number;
	/** Minimum price for products */
	'price-min'?: number;
	/** Maximum price for products */
	'price-max'?: number;
	/** Special type of products: featured, on-sale and new products */
	type?: SpecialProductTypesEnum;
}

export interface UserWishlistQueryParams {
	/** Whether to calculate prices only for single quantity. If true - product object will have fields: price, regularPrice, fromQuantity, vatRate, and salesUnit. If not true or not passed - product object will have prices property with array of prices config (each of which has those fields) */
	onlySingleQuantity?: boolean;
	/** Omit fields */
	omitFields?: ProductOmitFieldsEnum[] | '*';
}

export interface ProductCategoryInterface {
	/** Id of category */
	id: string;
	/** Name of category */
	name: string | Record<string, string>;
	/** Breadcrumb of category */
	breadcrumb: string | Record<string, string>;
}

export interface ProductAttributeInterface {
	/** Id of attribute */
	id: string;
	/** Unique key of attribute */
	key: string;
	/** Attribute name. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Attribute type */
	type: GlobalTypes.AttributeTypesEnum;
	/** Whether attribute is required */
	isRequired: boolean;
	/** Whether attribute is multilang */
	isMultilang: boolean;
	/** Whether attribute is included in product spec table */
	isIncludedInProductSpecificationTable?: boolean;
	/** Value of the attribute for product*/
	value: any;
	/** Attribute option id if attribute is select */
	optionId?: string;
	/** Attribute option ids if attribute is multiselect */
	optionIds?: string[];
}

export interface ProductPriceInterface {
	/** Price of product */
	price: number;
	/** Regular price of product - crossed out price */
	regularPrice?: null | number;
	/** From quantity */
	fromQuantity: number;
	/** VAT rate */
	vatRate: number;
	/** Sales unit */
	salesUnit: GlobalTypes.SaleUnitsEnum;
	/** Sale percentage - if present - means that store wants to show sale percentage and that regular price is larger than price - so there is a sale */
	salePercentage?: number;
}

export interface RelationsProduct {
	/** Id of product */
	_id: string;
	/** Id of product */
	id: string;
	/** Name of product */
	name: string;
	/** SKU of product */
	sku: string;
	/** Thumbnail of product */
	image: GlobalTypes.AssetInteface;
	/** Price of product */
	price: number;
	/** Regular price of product */
	regularPrice?: null | number;
	/** From quantity */
	fromQuantity: number;
	/** VAT rate */
	vatRate: number;
	/** Sales unit */
	salesUnit: GlobalTypes.SaleUnitsEnum;
}

export interface VariationProduct extends RelationsProduct {
	/** Attributes of product */
	attributes: ProductAttributeInterface[];
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
	brand?: null | { id: string; name: string | Record<string, string> };
	/** Brand model of product if any */
	brandModel?: null | { id: string; name: string | Record<string, string> };
	/** Number of items in stock */
	inStock?: null | number;
	/** Short description of product */
	shortDescription?: string | Record<string, string>;
	/** Description of product */
	description?: string | Record<string, string>;
	/** Condition of the product */
	condition?: 'new' | 'used';
	/** Main sales unit */
	mainSalesUnit?: GlobalTypes.SaleUnitsEnum;
	/** Product categories */
	categories: ProductCategoryInterface[];
	/** Product assets */
	assets: GlobalTypes.AssetInteface[];
	/** Product images - all will have type image */
	images: GlobalTypes.AssetInteface[];
	/** 360 degrees images */
	images360: GlobalTypes.AssetInteface[];
	/** Thumbnail image for the product */
	thumbnail?: GlobalTypes.AssetInteface;
	/** Product attributes */
	attributes: ProductAttributeInterface[];
	/** Shipping data */
	shipping?: {
		weight?: number;
		dimensions?: {
			length?: number;
			width?: number;
			height?: number;
		}
	}
	/** Prices of the product - for 'getProducts' method it will be present only if you have not requested 'onlySingleQuantity'. If 'onlySingleQuantity' is true - you will get price config for product where fromQuantity is 1. If 'getSingleProduct' is the method - all prices are always returned */
	prices?: ProductPriceInterface[];
	/** Price for product - only present if 'onlySingleQuantity' is true and method is 'getProducts' */
	price?: number;
	/** Regular price for product - only present if 'onlySingleQuantity' is true and method is 'getProducts' */
	regularPrice?: null | number;
	/** From quantity - only present if 'onlySingleQuantity' is true and method is 'getProducts' */
	fromQuantity?: number;
	/** VAT rate - only present if 'onlySingleQuantity' is true and method is 'getProducts' */
	vatRate?: number;
	/** Sale percentage - only shown when store wants to show sale percentage and regular price is larger than price - so there is a sale */
	salePercentage?: number;
	/** Sales unit - only present if 'onlySingleQuantity' is true and method is 'getProducts' */
	salesUnit?: GlobalTypes.SaleUnitsEnum;
	/** Product relations */
	relations?: {
		/** Name of the relation */
		name: string;
		/** Products in relation */
		products: RelationsProduct[];
	};
	/** Product variations */
	variations?: VariationProduct[];
	/** Add-On products - products that sell as addons to current product */
	addOnProducts?: {
		/** Name of the relation */
		name: string;
		/** Products in relation */
		products: RelationsProduct[];
	}[];
	/** Created at datetime string */
	createdAt: string;
	/** Updated at datetime string */
	updatedAt: string;
	/** Ribbon to display. If has value - always show as date check was done on server */
	ribbon?: string | Record<string, string> | null;
	/** SEO for the category */
	seo?: {
		title?: Record<string, string> | string;
		description?: Record<string, string> | string;
		image?: GlobalTypes.AssetInteface;
	}
	/** Variation attributes */
	variationAttributes?: ProductVariationAttribute[];
}

export interface ProductVariationAttribute extends ProductAttributeInterface {
	/** In variation attribute in cart, name of the product is always multilang - record where each key is lang. Example: {ba: 'Neko ime', en: 'Some name'} */
	name: Record<string, string>;
}