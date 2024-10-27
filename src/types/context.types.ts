import type * as UserTypes from "./user.types";
import type * as CartTypes from './cart.types';

export interface ShoplySDKContext {
	/** User id - if user is logged in it's his id, but if not - it's random uuid-like string. Used for cart */
	userId?: string;
	/** User object - if user is logged in */
	user?: UserTypes.User;
	/** Cart object - if user has a cart */
	cart?: CartTypes.Cart;
	/** Last accessToken that was returned from server */
	accessToken?: string;
	/** Last refreshToken that was returned from server */
	refreshToken?: string;
}