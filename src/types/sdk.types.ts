import type * as UserTypes from './user.types';
import type * as ConfigTypes from './config.types';
import type * as CartTypes from './cart.types';
import type * as ContextTypes from './context.types';
import type * as CategoryTypes from './category.types';
import type * as ProductTypes from './product.types';
import type * as GlobalTypes from './global.types';
import type * as MetaTypes from './meta.types';
import type * as OrderTypes from './order.types';

export interface ShoplyRequestError {
	status: number;
	message: string;
	data?: any;
	isInactive?: boolean;
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
	setCallbacks: (
		callbacks: ConfigTypes.ShoplySDKConfigCallbacks
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

	/** Get wishlist for user */
	getWishlist: (
		query?: ProductTypes.UserWishlistQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{ wishlist: ProductTypes.Product[] }>>;

	/** Update wishlist. If action is sent, that action is sent to server. If not, the action is opposite of current state. For example, if product is in wishlist, it will be removed if action is not sent, or 'remove' action is sent. If action is 'add' nothing will happen as item is already in wishlist. */
	updateWishlist: (
		/** Id or SKU of product to add/remove */
		identifier: string,
		action?: 'add' | 'remove',
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{ wishlistUpdated: boolean }>>;
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
		getProductCount?: boolean,
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
		query?: CategoryTypes.AttributeQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: CategoryTypes.CategoryAttribute[];
		total: number;
	}>>;

	/** Get brands and brand models for category - by category id. If no query is passed - it returns all brands and model */
	getBrandsForCategory: (
		categoryId: string,
		query?: CategoryTypes.BrandsQueryParams,
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

export interface ShoplySDKProductMethods {
	/** Paginate and/or search products. If no query is passed - behaves as 'get all products' and will return all items. But if at least one param is present in query - returns paginated results  */
	getProducts: (
		query?: ProductTypes.ProductsQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: ProductTypes.Product[];
		total: number;
	}>>;

	/** Get single product by id or sku */
	getSingleProduct: (
		/** Id or sku of product */
		identifier: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<ProductTypes.Product>>;
}

export interface ShoplySDKCartMethods {
	/** Get cart details */
	getCart: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		userId: string;
		cart: CartTypes.Cart;
	}>>;

	/** Add item to cart */
	addToCart: (
		productId: string,
		quantity?: number,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		userId: string;
		cart: CartTypes.Cart;
	}>>;

	/** Remove from cart */
	removeFromCart: (
		productId: string,
		quantity?: number,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		userId: string;
		cart: CartTypes.Cart;
	}>>;

	/** Clear cart */
	clearCart: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		userId: string;
		cart: CartTypes.Cart;
	}>>;

	/** Add coupon code to cart */
	addCouponCode: (
		couponCode: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		userId: string;
		cart: CartTypes.Cart;
	}>>;

	/** Remove coupon code from cart */
	removeCouponCode: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		userId: string;
		cart: CartTypes.Cart;
	}>>;
}

export interface ShoplySDKOrderMethods {
	/** Paginate orders for logged in user. If no query is passed - behaves as 'get all orders' and will return all items. But if at least one param is present in query (page/entries/sortField/sortType/search) - returns paginated results  */
	getOrders: (
		query?: GlobalTypes.DefaultQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: OrderTypes.Order[];
		total: number;
	}>>;

	/** Get single order for logged in user */
	getSingleOrder: (
		/** Id or orderNumber of order */
		identifier: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<OrderTypes.Order>>;

	/** Get public order details - mostly items - for an order. Use to fetch order data on success redirect page */
	getOrderItems: (
		/** Id or orderNumber of order */
		identifier: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<OrderTypes.PublicOrderData>>;

	/** Create order */
	createOrder: (
		data: OrderTypes.OrderData, // TODO
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		order: OrderTypes.Order;
		orderId: string;
		userId: string;
		cart: CartTypes.Cart;

		_redirectUrl?: string;
		_redirectHtml?: string;
		_scripts?: {
			src?: string;
			innerHTML?: string;
			type?: string;
			async?: boolean;
			defer?: boolean;
		}[];
	}>>;

	/** Check order payment status - Remember to call this method from success page to trigger check */
	checkOrderPaymentStatus: (
		orderId: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		order: OrderTypes.Order;
	}>>;
}

export interface ShoplySDKMetaMethods {
	/** Get a list of available payment methods. Note: payment is handled by server - you will not get sensitive data like api keys! */
	getAvailablePaymentMethods: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.PaymentMethodInterface[]>>;

	/** Get a list of available shipping providers */
	getAvailableShippingProviders: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.ShippingMethodInterface[]>>;

	/** Get a list of all available countries with valid country codes. Useful for country in user address. */
	getCountries: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.CountryInterface[]>>;

	/** Paginate site pages. If no query is passed - behaves as 'get all pages' and will return all items. But if at least one param is present in query (page/entries/sortField/sortType/search) - returns paginated results. Pages are always sent for the LANG in question. */
	getPages: (
		query?: GlobalTypes.DefaultQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: MetaTypes.MiniPageInterface[];
		total: number;
	}>>;

	/** Get single page - by page slug */
	getSinglePage: (
		slug: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.PageInterface>>;

	/** Get site contact settings */
	getContactInfo: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.ContactInterface>>;

	/** Get site social links */
	getSocialLinks: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.SocialsInterface>>;

	/** Paginate sliders. If no query is passed - behaves as 'get all sliders' and will return all items. But if at least one param is present in query (page/entries/sortField/sortType/search) - returns paginated results for LANG in question */
	getSliders: (
		query?: GlobalTypes.DefaultQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: MetaTypes.VisualsInterface[];
		total: number;
	}>>;

	/** Paginate banners. If no query is passed - behaves as 'get all banners' and will return all items. But if at least one param is present in query (page/entries/sortField/sortType/search) - returns paginated results for LANG in question */
	getBanners: (
		query?: GlobalTypes.DefaultQueryParams,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<{
		items: MetaTypes.VisualsInterface[];
		total: number;
	}>>;

	/** Get single slider for a specific position */
	getSliderForPosition: (
		position: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.VisualsInterface>>;

	/** Get sliders for positions - sorted by the order of supplied positions */
	getSlidersForPositions: (
		positions: string[],
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.VisualsInterface[]>>;

	/** Get single banner for a specific position */
	getBannerForPosition: (
		position: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.VisualsInterface>>;

	/** Get banners for positions - sorted by the order of supplied positions */
	getBannersForPositions: (
		positions: string[],
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.VisualsInterface[]>>;

	/** Get langs configuration */
	getLangs: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.LangsInterface>>;

	/** Get site config (theme and theme settings) */
	getSiteConfig: (
		getRbgValuesForColors?: boolean,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.SiteConfigInterface>>;

	/** Get currency data */
	getCurrencyData: (
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.CurrencyDataInterface>>;

	/** Get metadata for sitemap */
	getSitemapData: (
		type?: MetaTypes.SitemapDataTypeEnum,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.SitemapDataInterface>>;

	/** Subscribe to newsletter */
	subscribeToNewsletter: (
		email: string,
		lang?: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<ShoplySDKResponse<MetaTypes.NewsletterMailingListEntryInterface>>;
}

export interface ShoplySDKDevMethods {
	/** Open dashboard to add/edit banner/slider/category visual. If string is returned - string is error message. */
	openVisualEditor: (
		type: 'banner' | 'slider' | 'category',
		position: string,
		lang?: string,
		config?: ConfigTypes.ShoplySDKConfigForSingleRequest
	) => Promise<void | string>;
}