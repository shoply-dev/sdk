import type * as UserTypes from './users.types';
import type * as ConfigTypes from './config.types';
import type * as CartTypes from './cart.types';
import type * as ContextTypes from './context.types';

export interface ShoplyRequestError {
	status: number;
	message: string;
	data?: any;
}

export type ShoplySDKResponse<T extends any> = {
	data: null;
	error: ShoplyRequestError;
} | {
	data: T;
	error: null;
}

export interface ShoplySDKInternalMethods {
	/** Re-set config properties after initialization */
	setConfig: (
		config: ConfigTypes.ShoplySDKConfigSetter
	) => void;

	/** Get current config */
	getConfig: () => ConfigTypes.ShoplySDKConfig;

	/** Get current context */
	getContext: () => ContextTypes.ShoplySDKContext;
}

export interface ShoplySDKUserMethods {
	/** Register new user */
	register: (
		data: UserTypes.RegisterUserRequestBody,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User
	}>>;

	/** Login user */
	login: (
		data: UserTypes.LoginUserRequestBody,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User;
		cart?: CartTypes.Cart,
		accessToken?: string,
		refreshToken?: string
	}>>;

	/** Logout user */
	logout: (
		refreshToken?: string
	) => Promise<ShoplySDKResponse<{}>>;

	/** Verify user's accessToken and get user details */
	verify: (
		accessToken?: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User;
		cart?: CartTypes.Cart;
	}>>;
	
}