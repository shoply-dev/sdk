

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