import type * as UserTypes from './user.types';
import type * as ConfigTypes from './config.types';
import type * as CartTypes from './cart.types';
import type * as ContextTypes from './context.types';
import type * as CategoryTypes from './category.types';
import type { DefaultQueryParams } from './global.types';

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
	registerUser: (
		data: UserTypes.RegisterUserRequestBody,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User
	}>>;

	/** Login user */
	loginUser: (
		data: UserTypes.LoginUserRequestBody,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User;
		cart?: CartTypes.Cart,
		accessToken?: string,
		refreshToken?: string
	}>>;

	/** Logout user */
	logoutUser: (
		refreshToken?: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{}>>;

	/** Verify user's accessToken and get user details */
	verifyUser: (
		accessToken?: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User;
		cart?: CartTypes.Cart;
	}>>;
	
	/** Create reset-password-code for user who forgot their email address */
	forgotPassword: (
		email: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		email: string;
		resetPasswordCodeSent: boolean;
	}>>;

	/** Reset user's password. Extract uid and code from url query and send it together with user's new password. If repeatPassword is also sent - additional check is made to see if passwords match */
	resetPassword: (
		data: {
			uid: string;
			code: string;
			password: string;
			repeatPassword?: string;
		},
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		email: string;
		passwordReset: boolean;
	}>>;

	/** Get user's profile details. User must be logged in - accessToken must exist. */
	getUserProfile: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User;
	}>>;

	/** Update user's profile details. User must be logged in - accessToken must exist. */
	updateUserProfile: (
		data: UserTypes.UpdateUserProfileRequestBody,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		user: UserTypes.User;
	}>>;

	/** Change user's password. User must be logged in - accessToken must exist. */
	changeUserPassword: (
		data: UserTypes.ChangeUserPasswordRequestBody,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		passwordUpdated: boolean;
	}>>;
}

export interface ShoplySDKCategoryMethods {
	/** Paginate categories. If no query is passed - behaves as 'get all categories' and will return all items. But if at least one param is present in query (page/entries/sortField/sortType/search/parent) - return paginated results  */
	getCategories: (
		query?: CategoryTypes.CategoryQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: CategoryTypes.Category[]; 
		total: number;
	}>>;

	/** Get category tree */
	getCategoryTree: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<CategoryTypes.CategoryTree[]>>;

	/** Get single category */
	getSingleCategory: (
		/** Id or breadcrumb */
		identifier: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<CategoryTypes.Category>>;

	/** Get attributes for category - by category id */
	getAttributesForCategory: (
		categoryId: string,
		query?: DefaultQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: CategoryTypes.CategoryAttribute[];
		total: number;
	}>>;

	/** Get brands and brand models for category - by category id. If no query is passed - it returns all brands and model */
	getBrandsForCategory: (
		categoryId: string,
		query?: CategoryTypes.CategoryQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: CategoryTypes.CategoryBrand[];
		total: number;
	}>>;

	/** Get brands tree */
	getBrandsTree: (
		categoryId: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<CategoryTypes.BrandTree[]>>;

	/** Get brand models */
	getBrandModels: (
		categoryId: string,
		brandId: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<CategoryTypes.CategoryBrand[]>>;
}