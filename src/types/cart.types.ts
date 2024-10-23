import type { ImageInterface } from "./global.types";

export interface CartItem {
	/** Product id. Same as productId */
	_id: string;
	/** Product id. Same as _id */
	productId: string;
	/** Product SKU number */
	sku: string;
	/** Product EAN code */
	eanCode?: string;
	/** Product name. If skipTransform in config is true - will be an object whose keys are different language keys and values actual names. If no skipTransform is passed to config -will be string - a name for passed (or default) lang */
	name: string | Record<string, string>;
	/** Thumbnail image of product, if exists */
	image?: ImageInterface | null;

	/** Product quantity in cart */
	quantity: number;
	/** Product price per item */
	price: number;
	/** Product regular price per item (if the same as price - you might not want to show it). Cart and orders are calculated from price, and regularPrice is only for styling purposes (to be crossed out in product card, for example) */
	regularPrice: number;
	/** Product vat rate in percent. Defaults to 0 */
	vatRate: number;
	/** Product sale units. Defaults to 'pc'. */
	salesUnit: string;
}

export interface Cart {
	/** Cart id. UserId is the field used for cart manipulation so you can disregard this id */
	_id: string;
	/** User id for cart operations */
	userId: string;
	/** Array of cart items */
	items: CartItem[];
}