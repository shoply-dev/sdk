

export interface ImageInterface {
	_uuid: string;
	path: string;
	name: string;
	size: number;
	placeholder?: string;

	main?: any;
	order?: any;
	isGif?: boolean;
}

export interface DefaultQueryParams {
	/** Page number */
	page?: number;
	/** Number of entries per page */
	entries?: number;
	/** Search term */
	search?: string;
	/** Sort by */
	sortField?: string;
	/** Sort type */
	sortType?: 'asc' | 'desc' | 1 | -1 | '1' | '-1';
}

export type AttributeTypesEnum = 'string' | 'multiline-string' | 'html' | 'integer' | 'decimal' | 'select' | 'multi-select' | 'date' | 'url' | 'boolean' | 'media-single' | 'media-gallery';

export type SaleUnitsEnum = 'pc' | 'pkg' | 'plt' | 'kg' | 'g' | 'mg' | 'l' | 'ml' | 'm^3' | 'm^2' | 'm' | 'cm' | 'mm';

export type AssetTypesEnum = 'image' | 'video' | 'document';

export type PageTypesEnum = 'privacy-policy' | 'terms-of-service' | 'return-policy' | 'other';

export interface AssetInteface {
	/** Id of asset */
	id: string;
	/** UUID */
	uuid?: string
	/** Type of asset */
	type: AssetTypesEnum;
	/** Path of asset */
	path: string;
	/** Name of asset */
	name?: string;
	/** Size of asset - in bytes */
	size?: number;
	/** Placeholder of asset - base64 image in 20x20 */
	placeholder?: string;
	/** Thumbnail - path to thumbnail image - smaller in size */
	thumbnail?: string;
	/** Orientation of image */
	orientation?: 'horizontal' | 'vertical';
}