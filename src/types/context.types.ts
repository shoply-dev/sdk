import type * as UserTypes from "./users.types";
import type * as CartTypes from './cart.types';

export interface ShoplySDKContext {
	/** User object - if user is logged in */
	user?: UserTypes.User;
	/** Cart object - if user has a cart */
	cart?: CartTypes.Cart;
	/** Last accessToken that was returned from server */
	accessToken?: string;
	/** Last refreshToken that was returned from server */
	refreshToken?: string;
}