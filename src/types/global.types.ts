

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