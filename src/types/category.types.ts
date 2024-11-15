import type { AssetInteface, AttributeTypesEnum, DefaultQueryParams } from "./global.types";


export interface CategoryQueryParams extends DefaultQueryParams {
	/** Id of parent category/brand */
	parent?: string;
	/** Allowed sort fields */
	sortField?: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'breadcrumb';
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