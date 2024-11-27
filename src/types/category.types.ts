import type { AssetInteface, AttributeTypesEnum, DefaultQueryParams, SaleUnitsEnum } from "./global.types";


export interface CategoryQueryParams extends DefaultQueryParams {
	/** Id of parent category/brand */
	parent?: string;
	/** Allowed sort fields */
	sortField?: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'breadcrumb';
	/** How many featured products to return. If it's floor is positive integer - only featured categories along with their featured products will be sent */
	featuredProducts?: number;
}

export interface BrandsQueryParams extends DefaultQueryParams {
	/** Id of parent category/brand */
	parent?: string;
	/** Allowed sort fields */
	sortField?: 'id' | 'createdAt' | 'updatedAt' | 'name';
}

export interface AttributeQueryParams extends DefaultQueryParams {
	/** Allowed sort fields */
	sortField?: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'key' | 'type';
};

export interface CategoryBrand {
	/** Id of category brand. Use _id instead of id */
	_id: string;
	/** Id of category brand. Use _id instead of id */
	id: string;
	/** Name of category brand. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Whether it's active brand/model or not */
	isActive: boolean;
	/** Id of category to which it belongs */
	category: string;
	/** Id of parent - if any. If null - the brand is root or main brand. If has parent - than it's to be considered as brand model rather than brand itself */
	parent?: string | null;
	/** Whether it has children */
	hasChildren?: boolean;
	/** Created at datetime string */
	createdAt: string;
	/** Updated at datetime string */
	updatedAt: string;
}

export interface CategoryAttribute {
	/** Id of attribute */
	id: string;
	/** Unique key of attribute */
	key: string;
	/** Attribute name. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Attribute type */
	type: AttributeTypesEnum;
	/** Whether to show attributes in product spec table */
	isIncludedInProductSpecificationTable?: boolean;
	/** Whether attribute is enabled */
	isEnabled?: boolean;
	/** Whether attribute is required */
	isRequired: boolean;
	/** Whether attribute is multilang */
	isMultilang: boolean;
	/** Attribute options */
	options?: {
		id: string;
		value: any;
	}[];
	/** Created at datetime string */
	createdAt?: string;
	/** Updated at datetime string */
	updatedAt?: string;
}

export interface CategoryVisualInterface {
	/** Image */
	image: {
		desktop: AssetInteface;
		tablet: AssetInteface;
		mobile: AssetInteface;
	};
	/** Alt text */
	alt: string;
}

export interface Category {
	/** Id of category. Use instead of id. */
	_id: string;
	/** Id of category. Use _id instead */
	id: string;
	/** Category name. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Breadcrumb of category. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	breadcrumb: string | Record<string, string>;
	/** Whether category is active or not */
	isActive: boolean;
	/** Id of parent category, or null if category is root category */
	parent?: string | null;
	/** Whether category has subcategories */
	hasChildren?: boolean;
	/** Category attributes */
	attributes?: CategoryAttribute[];
	/** Category visual data */
	visual?: CategoryVisualInterface;
	/** Created at datetime string */
	createdAt: string;
	/** Updated at datetime string */
	updatedAt: string;
}

export interface CategoryInTree {
	/** Id of category */
	_id: string;
	/** Name of category. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Breadcrumb of category. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	breadcrumb: string | Record<string, string>;
	/** Count of products in that category (if has subcategories, includes them too). Only supplied if getProductCount is true */
	productsCount?: number;
	/** Visual of the category */
	visual?: CategoryVisualInterface;
}

export interface CategoryTree extends CategoryInTree {
	/** Children categories of category - if any */
	children?: CategoryTree[];
}

export interface BrandInTree {
	/** Id of brand */
	_id: string;
	/** Name of brand. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
}

export interface BrandTree extends BrandInTree {
	/** Children brands of brand - if any */
	children?: BrandTree[];
}

export interface CategoryFeaturedProductInterface {
	/** Id of product. Use instead of id. */
	_id: string;
	/** Id of product. Use _id instead */
	id: string;
	/** SKU of product */
	sku: string;
	/** Name of product. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Number of items in stock */
	inStock?: null | number;
	/** Thumbnail image for the product */
	thumbnail?: AssetInteface;
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
	salesUnit?: SaleUnitsEnum;
}