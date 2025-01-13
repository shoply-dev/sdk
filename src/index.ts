import * as Axios from './services/axios.service';
import * as Validator from "./utils/validators.utils";
import * as Errors from "./services/error.service";
import { AxiosError } from 'axios';

import type { AxiosInstance } from "axios";
import type * as  ConfigTypes from "./types/config.types";
import type * as UserTypes from './types/user.types';
import type * as ContextTypes from './types/context.types';
import type * as CartTypes from './types/cart.types';
import type * as CategoryTypes from './types/category.types';
import type * as SDKTypes from './types/sdk.types';
import type * as ProductTypes from './types/product.types';
import type * as MetaTypes from './types/meta.types';
import type * as OrderTypes from './types/order.types';
import type * as GlobalTypes from './types/global.types';

const AssetTypesEnum = ['image', 'video', 'document'];

interface ShoplyMiniChatInterface {
	onLoad?: () => void;
	showMiniChat?: (data: null | {
		sku?: string;
		externalId?: string;
		platform?: string;
	}) => void;
}

declare global {
	var shoply: ShoplyMiniChatInterface | undefined;
}

export class ShoplySDK {
	private axios: AxiosInstance;
	private context: ContextTypes.ShoplySDKContext = {};

	constructor(
		private config: ConfigTypes.ShoplySDKConfig,
		private debug: boolean = false
	) {
		if (!this.config.baseURL || !Validator.isValidUrl(this.config.baseURL)) throw new Error('Invalid baseURL');

		const instance = Axios.createAxiosInstance(this.config, this.context);
		const axios = Axios.configureAxiosInterceptors(instance, this.config, this.context, (at, rt) => {
			if (at) this.context.accessToken = at;
			if (rt) this.context.refreshToken = rt;
		});
		this.axios = axios;

		this._log('Config initialized: ' + this.config);
	};

	private _log = (msg: string, type: 'log' | 'warn' | 'error' = 'log') => {
		if (this.debug) console[type](`ShoplySDK: ${msg}`);
	};

	private prepareFetch = (
		singleConfig: ConfigTypes.ShoplySDKConfigForSingleRequest = {}
	) => {
		const config = {
			...this.config,
			...singleConfig,
		};
		const axiosConfig = Axios.transformShoplyConfigToAxiosConfig(config, this.context);
		return axiosConfig;
	};

	private appendBaseURLtoAssets = (obj: any, baseUrl: string): any => {
		if (typeof obj !== 'object') return obj;
		if (Array.isArray(obj)) return obj.map(item => this.appendBaseURLtoAssets(item, baseUrl));
		if (obj && 'type' in obj && obj.type && AssetTypesEnum.includes(obj.type)) {
			if (obj.path) obj.path = baseUrl + obj.path;
			if (obj.thumbnail) obj.thumbnail = baseUrl + obj.thumbnail;

			return obj;
		}

		for (const key in obj) {
			obj[key] = this.appendBaseURLtoAssets(obj[key], baseUrl);
		}

		return obj;
	};

	private removeIntegrationsObjectFromAssets = (obj: any): any => {
		if (typeof obj !== 'object') return obj;
		if (Array.isArray(obj)) return obj.map(item => this.removeIntegrationsObjectFromAssets(item));
		if (obj && 'type' in obj && obj.type && AssetTypesEnum.includes(obj.type)) {
			if ('integrations' in obj) delete obj.integrations;
			return obj;
		}

		for (const key in obj) {
			obj[key] = this.removeIntegrationsObjectFromAssets(obj[key]);
		}

		return obj;
	}

	private fetch = async <T extends any>(
		obj: ConfigTypes.ShoplySDKFetchRequest
	): Promise<SDKTypes.ShoplySDKResponse<T>> => {
		try {
			const config = this.prepareFetch(obj.config);

			const appendBaseURLtoAssets = typeof obj.config?.appendBaseURLtoAssets === 'boolean' ? (
				obj.config.appendBaseURLtoAssets
			) : typeof this.config.appendBaseURLtoAssets === 'boolean' ? (
				this.config.appendBaseURLtoAssets
			) : (
				false
			);

			const response = await this.axios({
				...config as any,
				url: obj.url,
				method: obj.method,
				data: obj.data,
				params: obj.params,
			});

			this._log(`response: ${JSON.stringify(response.data)}`);

			if (response?.status && response.status >= 200 && response.status < 300 && response.data) {
				const responseData = this.removeIntegrationsObjectFromAssets(response.data.data);

				if (appendBaseURLtoAssets) {
					const baseUrl = obj.config?.baseURL || this.config.baseURL;
					const data = this.appendBaseURLtoAssets(responseData, baseUrl);
					return {
						data,
						error: null
					}
				}

				return {
					data: responseData,
					error: null
				}
			}

			return {
				data: null,
				error: {
					status: 500,
					message: Errors.defaultServerErrorMessage
				}
			}
		} catch (err) {
			this._log(`error fetching data: ${err}`, 'error');

			const error = err instanceof AxiosError ? Errors.handleAxiosError(err as any) : {
				status: 500,
				message: Errors.defaultServerErrorMessage
			}

			return {
				data: null,
				error
			}
		}
	};

	private setContext = (
		context: ContextTypes.ShoplySDKContext
	) => {
		this.context = {
			...this.context,
			...context
		};
		this._log(`Context updated: ${JSON.stringify(this.context)}`);
	}

	internal: SDKTypes.ShoplySDKInternalMethods = {
		setConfig: (config: ConfigTypes.ShoplySDKConfigSetter) => {
			this.config = {
				...this.config,
				...config,
			}

			const instance = Axios.createAxiosInstance(this.config, this.context);
			const axios = Axios.configureAxiosInterceptors(instance, this.config, this.context, (at, rt) => {
				if (at) {
					this.context.accessToken = at;
					this.config.callbacks?.onAccessToken?.(at);
				}
				if (rt) {
					this.context.refreshToken = rt;
					this.config.callbacks?.onRefreshToken?.(rt);
				}
			});
			this.axios = axios;

			this._log('Config updated: ' + this.config);
		},

		setCallbacks: (cbs: ConfigTypes.ShoplySDKConfigCallbacks) => {
			this.config.callbacks = {
				...(this.config.callbacks || {}),
				...cbs
			}

			this._log('Callbacks updated: ' + this.config.callbacks);
		},

		getConfig: () => this.config,

		getContext: () => this.context,
	};

	users: SDKTypes.ShoplySDKUserMethods = {
		registerUser: (
			data: UserTypes.RegisterUserRequestBody,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{ user: UserTypes.User }>({
			url: '/users/register',
			method: 'POST',
			data,
			config
		}),

		loginUser: async (
			data: UserTypes.LoginUserRequestBody,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				user: UserTypes.User,
				cart?: CartTypes.Cart,
				accessToken?: string,
				refreshToken?: string
			}>({
				url: '/users/login',
				method: 'POST',
				data,
				config
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					user: response.data.user,
					userId: response.data.user._id,
					accessToken: response.data.accessToken,
					refreshToken: response.data.refreshToken,
				};

				this.config.callbacks?.onUser?.(contextObj.user);
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onAccessToken?.(this.context.accessToken);
				this.config.callbacks?.onRefreshToken?.(this.context.refreshToken);


				if (typeof response.data.cart === 'object') {
					contextObj.cart = response.data.cart;
					this.config.callbacks?.onCart?.(contextObj.cart);
				}

				this.setContext(contextObj);
			}

			return response;
		},

		logoutUser: async (
			refreshToken?: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{}>({
				url: '/users/logout',
				method: 'POST',
				data: refreshToken ? { refreshToken } : undefined,
				config
			});

			if (response.data) {
				this.setContext({
					user: undefined,
					userId: undefined,
					cart: undefined,
					accessToken: undefined,
					refreshToken: undefined,
				});

				this.config.callbacks?.onUser?.(this.context.user);
				this.config.callbacks?.onUserId?.(this.context.userId);
				this.config.callbacks?.onCart?.(this.context.cart);
				this.config.callbacks?.onAccessToken?.(this.context.accessToken);
				this.config.callbacks?.onRefreshToken?.(this.context.refreshToken);
			}

			return response;
		},

		verifyUser: async (
			accessToken?: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				user: UserTypes.User,
				cart?: CartTypes.Cart
			}>({
				url: '/users/verify',
				method: 'POST',
				data: accessToken ? { accessToken } : undefined,
				config
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					user: response.data.user,
					userId: response.data.user._id,
				};
				this.config.callbacks?.onUser?.(contextObj.user);
				this.config.callbacks?.onUserId?.(contextObj.userId);
				if (typeof response.data.cart === 'object') {
					contextObj.cart = response.data.cart;
					this.config.callbacks?.onCart?.(contextObj.cart);
				}

				this.setContext(contextObj);
			} else {
				this.setContext({
					user: undefined,
					userId: undefined,
					cart: undefined,
					accessToken: undefined,
					refreshToken: undefined,
				});

				this.config.callbacks?.onUser?.(this.context.user);
				this.config.callbacks?.onUserId?.(this.context.userId);
				this.config.callbacks?.onCart?.(this.context.cart);
				this.config.callbacks?.onAccessToken?.(this.context.accessToken);
				this.config.callbacks?.onRefreshToken?.(this.context.refreshToken);
			}

			return response;
		},

		forgotPassword: async (
			email: string,
			redirectUrl?: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			email: string;
			resetPasswordCodeSent: boolean;
		}>({
			url: '/users/forgot-password',
			method: 'POST',
			data: { email, redirectUrl },
			config
		}),

		resetPassword: async (
			data: {
				uid: string;
				code: string;
				password: string;
				repeatPassword?: string;
			},
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			email: string;
			passwordReset: boolean;
		}>({
			url: '/users/reset-password',
			method: 'POST',
			data,
			config
		}),

		getUserProfile: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{ user: UserTypes.User }>({
				url: '/users/profile',
				method: 'GET',
				config
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					user: response.data.user,
					userId: response.data.user._id,
				};
				this.config.callbacks?.onUser?.(contextObj.user);
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.setContext(contextObj);
			}

			return response;
		},

		updateUserProfile: async (
			data: UserTypes.UpdateUserProfileRequestBody,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{ user: UserTypes.User }>({
				url: '/users/profile',
				method: 'POST',
				data,
				config
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					user: response.data.user,
					userId: response.data.user._id,
				};
				this.config.callbacks?.onUser?.(contextObj.user);
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.setContext(contextObj);
			}

			return response;
		},

		changeUserPassword: async (
			data: UserTypes.ChangeUserPasswordRequestBody,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			passwordUpdated: boolean;
		}>({
			url: '/users/change-password',
			method: 'POST',
			data,
			config
		}),

		getWishlist: async (
			query?: ProductTypes.UserWishlistQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const params: any = {
				...(query || {}),
				omit: query?.omitFields ? (
					typeof query.omitFields === 'string' ? (
						'*'
					) : (
						Array.isArray(query.omitFields) && query.omitFields.length > 0 ? (
							query.omitFields.join(',')
						) : (
							undefined
						)
					)
				) : (
					undefined
				),
			};
			delete params.omitFields;

			const response = await this.fetch<{
				wishlist: ProductTypes.Product[];
			}>({
				url: '/users/wishlist',
				method: 'GET',
				params: {
					...(query || {}),
				},
				config
			});

			return response;
		},

		updateWishlist: async (
			identifier: string,
			action?: 'add' | 'remove',
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const body: any = {
				productId: identifier,
			};
			if (action) body['action'] = action;
			const response = await this.fetch<{
				wishlistUpdated: boolean
			}>({
				method: 'POST',
				url: '/users/wishlist',
				data: body,
				config
			});

			return response;
		}
	};

	categories: SDKTypes.ShoplySDKCategoryMethods = {
		getCategories: async (
			query?: CategoryTypes.CategoryQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			items: CategoryTypes.Category[];
			total: number;
		}>({
			url: '/categories',
			method: 'GET',
			params: query,
			config
		}),

		getCategoryTree: async (
			getProductCount: boolean = false,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<CategoryTypes.CategoryTree[]>({
			url: '/categories/tree',
			method: 'GET',
			config,
			params: getProductCount ? { productCount: 'true' } : undefined
		}),

		getSingleCategory: async (
			identifier: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			if (!identifier || identifier === 'tree') return {
				data: null,
				error: {
					status: 400,
					message: identifier === 'tree' ? 'To get category tree call "getCategoryTree" method instead!' : 'Invalid identifier!',
				}
			}
			if (!Validator.isValidObjectId(identifier)) identifier = encodeURIComponent(decodeURIComponent(identifier));

			const response = await this.fetch<CategoryTypes.Category>({
				url: `/categories/${identifier}`,
				method: 'GET',
				config
			});

			return response;
		},

		getAttributesForCategory: async (
			categoryId: string,
			query?: CategoryTypes.AttributeQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			if (!Validator.isValidObjectId(categoryId)) return {
				data: null,
				error: {
					status: 400,
					message: 'Invalid category id!'
				}
			}

			const response = await this.fetch<{
				items: CategoryTypes.CategoryAttribute[];
				total: number;
			}>({
				url: `/categories/${categoryId}/attributes`,
				method: 'GET',
				params: query,
				config
			});

			return response;
		},

		getBrandsForCategory: async (
			categoryId: string,
			query?: CategoryTypes.BrandsQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			if (!Validator.isValidObjectId(categoryId)) return {
				data: null,
				error: {
					status: 400,
					message: 'Invalid category id!'
				}
			}

			const response = await this.fetch<{
				items: CategoryTypes.CategoryBrand[];
				total: number;
			}>({
				url: `/categories/${categoryId}/brands`,
				method: 'GET',
				params: query,
				config
			});

			return response;
		},

		getBrandsTree: async (
			categoryId: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			if (!Validator.isValidObjectId(categoryId)) return {
				data: null,
				error: {
					status: 400,
					message: 'Invalid category id!'
				}
			}

			const response = await this.fetch<CategoryTypes.BrandTree[]>({
				url: `/categories/${categoryId}/brands/tree`,
				method: 'GET',
				config
			});

			return response;
		},

		getBrandModels: async (
			categoryId: string,
			brandId: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			if (!Validator.isValidObjectId(categoryId) || !Validator.isValidObjectId(brandId)) return {
				data: null,
				error: {
					status: 400,
					message: 'Invalid category or brand id!'
				}
			}

			const response = await this.fetch<CategoryTypes.CategoryBrand[]>({
				url: `/categories/${categoryId}/brands/${brandId}`,
				method: 'GET',
				config
			});

			return response;
		},
	}

	products: SDKTypes.ShoplySDKProductMethods = {
		getProducts: async (
			query?: ProductTypes.ProductsQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {

			const params: any = {
				...(query || {}),
				onlySingleQuantity: query?.onlySingleQuantity ? 'true' : undefined,
				category: query?.category ? (
					typeof query.category === 'string' ? (
						query.category
					) : (
						Array.isArray(query.category) && query.category.length > 0 ? (
							query.category.join(',')
						) : (
							undefined
						)
					)
				) : undefined,
				brand: query?.brand ? (
					typeof query.brand === 'string' ? (
						query.brand
					) : (
						Array.isArray(query.brand) && query.brand.length > 0 ? (
							query.brand.join(',')
						) : (
							undefined
						)
					)
				) : undefined,
				model: query?.brandModel ? (
					typeof query.brandModel === 'string' ? (
						query.brandModel
					) : (
						Array.isArray(query.brandModel) && query.brandModel.length > 0 ? (
							query.brandModel.join(',')
						) : (
							undefined
						)
					)
				) : undefined,
				omit: query?.omitFields ? (
					typeof query.omitFields === 'string' ? (
						'*'
					) : (
						Array.isArray(query.omitFields) && query.omitFields.length > 0 ? (
							query.omitFields.join(',')
						) : (
							undefined
						)
					)
				) : (
					undefined
				),
			}

			delete params.omitFields;
			delete params.brandModel;
			delete params.attributes;

			if (query?.attributes) {
				for (const key in query.attributes) {
					params[`attr.${key}`] = Array.isArray(query.attributes[key]) ? query.attributes[key].join('|') : query.attributes[key];
				}
			}

			const response = await this.fetch<{
				items: ProductTypes.Product[];
				total: number;
			}>({
				method: 'GET',
				url: '/products',
				config,
				params
			});

			return response;
		},

		getSingleProduct: async (
			identifier: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<ProductTypes.Product>({
			method: 'GET',
			url: `/products/${encodeURIComponent(decodeURIComponent(identifier))}`,
			config,
		}),
	};

	cart: SDKTypes.ShoplySDKCartMethods = {
		getCart: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				userId: string;
				cart: CartTypes.Cart;
			}>({
				url: '/cart',
				method: 'GET',
				config
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					userId: response.data.userId,
					cart: response.data.cart,
				};
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onCart?.(contextObj.cart);
				this.setContext(contextObj);
			}

			return response;
		},

		addToCart: async (
			productId: string,
			quantity: number = 1,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				userId: string;
				cart: CartTypes.Cart;
			}>({
				method: 'POST',
				url: '/cart',
				data: {
					action: 'add',
					productId,
					quantity,
				},
				config,
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					userId: response.data.userId,
					cart: response.data.cart,
				};
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onCart?.(contextObj.cart);
				this.setContext(contextObj);
			}

			return response;
		},

		removeFromCart: async (
			productId: string,
			quantity: number = 1,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				userId: string;
				cart: CartTypes.Cart;
			}>({
				method: 'POST',
				url: '/cart',
				data: {
					action: 'remove',
					productId,
					quantity,
				},
				config,
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					userId: response.data.userId,
					cart: response.data.cart,
				};
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onCart?.(contextObj.cart);
				this.setContext(contextObj);
			}

			return response;
		},

		clearCart: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				userId: string;
				cart: CartTypes.Cart;
			}>({
				method: 'POST',
				url: '/cart',
				data: {
					action: 'clear',
				},
				config,
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					userId: response.data.userId,
					cart: response.data.cart,
				};
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onCart?.(contextObj.cart);
				this.setContext(contextObj);
			}

			return response;
		},

		addCouponCode: async (
			couponCode: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				userId: string;
				cart: CartTypes.Cart;
			}>({
				method: 'POST',
				url: '/cart',
				data: {
					action: 'add-coupon',
					couponCode,
				},
				config,
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					userId: response.data.userId,
					cart: response.data.cart,
				};
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onCart?.(contextObj.cart);
				this.setContext(contextObj);
			}

			return response;
		},

		removeCouponCode: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				userId: string;
				cart: CartTypes.Cart;
			}>({
				method: 'POST',
				url: '/cart',
				data: {
					action: 'remove-coupon',
				},
				config,
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					userId: response.data.userId,
					cart: response.data.cart,
				};
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onCart?.(contextObj.cart);
				this.setContext(contextObj);
			}

			return response;
		}
	}

	orders: SDKTypes.ShoplySDKOrderMethods = {
		getOrders: async (
			query?: GlobalTypes.DefaultQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			items: OrderTypes.Order[];
			total: number;
		}>({
			method: 'GET',
			url: '/orders',
			params: query,
			config,
		}),

		getSingleOrder: async (
			identifier: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<OrderTypes.Order>({
			method: 'GET',
			url: `/orders/${encodeURIComponent(decodeURIComponent(identifier))}`,
			config,
		}),

		getOrderItems: async (
			identifier: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<OrderTypes.PublicOrderData>({
			method: 'GET',
			url: `/orders/${encodeURIComponent(decodeURIComponent(identifier))}/items`,
			config,
		}),

		createOrder: async (
			data: OrderTypes.OrderData,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			const response = await this.fetch<{
				order: OrderTypes.Order;
				orderId: string;
				userId: string;
				cart: CartTypes.Cart;
				_redirectUrl?: string;
				_redirectHtml?: string;
				_redirectBody?: string;
				_scripts?: {
					src?: string;
					innerHTML?: string;
					type?: string;
					async?: boolean;
					defer?: boolean;
					id?: string;
				}[];
			}>({
				method: 'POST',
				url: '/orders',
				data,
				config,
			});

			if (response.data) {
				const contextObj: ContextTypes.ShoplySDKContext = {
					userId: response.data.userId,
					cart: response.data.cart,
				};
				this.config.callbacks?.onUserId?.(contextObj.userId);
				this.config.callbacks?.onCart?.(contextObj.cart);
				this.setContext(contextObj);

				if (response.data._redirectUrl) {
					if (typeof window !== 'undefined') {
						window.location.replace(response.data._redirectUrl);
					}
				}

				if (response.data._redirectHtml) {
					if (typeof document !== 'undefined') {
						document.write(response.data._redirectHtml);
					}
				}

				if (response.data._redirectBody) {
					if (typeof document !== 'undefined') {
						document.body.innerHTML = response.data._redirectBody;
					}
				}

				if (response.data._scripts && Array.isArray(response.data._scripts)) {
					if (typeof document !== 'undefined') {
						for (const obj of response.data._scripts) {
							if (!obj) continue;
							const script = document.createElement('script');
							for (const key in obj) {
								if (key && key in obj && obj[key as 'src']) script[key as 'src'] = obj![key! as 'src'] as string;
							}

							document.body.appendChild(script);
						}
					}
				}
			}

			return response;
		},

		checkOrderPaymentStatus: async (
			orderId: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			order: OrderTypes.Order;
		}>({
			method: 'PUT',
			url: `/orders/${encodeURIComponent(decodeURIComponent(orderId))}/payment-status`,
			config,
		}),
	};

	meta: SDKTypes.ShoplySDKMetaMethods = {
		getAvailablePaymentMethods: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.PaymentMethodInterface[]>({
			method: 'GET',
			url: '/meta/payment-methods',
			config,
		}),

		getAvailableShippingProviders: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.ShippingMethodInterface[]>({
			method: 'GET',
			url: '/meta/shipping-providers',
			config,
		}),

		getCountries: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.CountryInterface[]>({
			method: 'GET',
			url: '/meta/all-countries',
			config,
		}),

		getPages: async (
			query?: GlobalTypes.DefaultQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			items: MetaTypes.MiniPageInterface[];
			total: number;
		}>({
			method: 'GET',
			url: '/meta/pages',
			params: query,
			config,
		}),

		getSinglePage: async (
			slug: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.PageInterface>({
			method: 'GET',
			url: `/meta/pages/${encodeURIComponent(decodeURIComponent(slug))}`,
			config,
		}),

		getContactInfo: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.ContactInterface>({
			method: 'GET',
			url: '/meta/contact',
			config,
		}),

		getSocialLinks: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.SocialsInterface>({
			method: 'GET',
			url: '/meta/socials',
			config,
		}),

		getSliders: async (
			query?: GlobalTypes.DefaultQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			items: MetaTypes.VisualsInterface[];
			total: number;
		}>({
			method: 'GET',
			url: '/meta/visuals',
			params: {
				...(query || {}),
				type: 'slider',
			},
			config,
		}),

		getBanners: async (
			query?: GlobalTypes.DefaultQueryParams,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{
			items: MetaTypes.VisualsInterface[];
			total: number;
		}>({
			method: 'GET',
			url: '/meta/visuals',
			params: {
				...(query || {}),
				type: 'banner',
			},
			config,
		}),

		getSliderForPosition: async (
			position: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.VisualsInterface>({
			method: 'GET',
			url: `/meta/visuals`,
			config,
			params: {
				type: 'slider',
				position,
			}
		}),

		getSlidersForPositions: async (
			positions: string[],
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.VisualsInterface[]>({
			method: 'GET',
			url: `/meta/visuals`,
			config,
			params: {
				type: 'slider',
				positions: positions.join(',')
			}
		}),

		getBannerForPosition: async (
			position: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.VisualsInterface>({
			method: 'GET',
			url: `/meta/visuals`,
			config,
			params: {
				type: 'banner',
				position,
			}
		}),

		getBannersForPositions: async (
			positions: string[],
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.VisualsInterface[]>({
			method: 'GET',
			url: `/meta/visuals`,
			config,
			params: {
				type: 'banner',
				positions: positions.join(',')
			}
		}),

		getLangs: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.LangsInterface>({
			method: 'GET',
			url: '/meta/langs',
			config,
		}),

		getSiteConfig: async (
			getRbgValuesForColors?: boolean,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.SiteConfigInterface>({
			method: 'GET',
			url: '/meta/config',
			config,
			params: getRbgValuesForColors ? { rgb: 'true' } : undefined
		}),

		getCurrencyData: async (
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.CurrencyDataInterface>({
			method: 'GET',
			url: '/meta/currency-data',
			config,
		}),

		getSitemapData: async (
			type?: MetaTypes.SitemapDataTypeEnum,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.SitemapDataInterface>({
			method: 'GET',
			url: `/meta/sitemap-data/${type || 'all'}`,
			config,
		}),

		subscribeToNewsletter: async (
			email: string,
			lang?: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<MetaTypes.NewsletterMailingListEntryInterface>({
			method: 'POST',
			url: '/meta/newsletter/subscribe',
			data: { email, lang },
			config,
		}),

		sendContactMessage: async (
			data: MetaTypes.SendContactMessageInputDataInterface,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{ messageSent?: boolean }>({
			method: 'POST',
			url: '/meta/contact/send-message',
			data,
			config,
		})
	}

	chat: SDKTypes.ShoplySDKChatMethods = {
		initChatScript: (sku?: string) => {
			try {
				if (typeof document !== 'undefined') {
					const script = document.createElement('script');
					script.src = `${this.config.baseURL}/chat/script`;
					script.crossOrigin = 'anonymous';
					script.async = true;
					script.onload = () => {
						if (sku) {
							window.shoply = {
								onLoad: () => {
									window.shoply?.showMiniChat?.({ sku });
								}
							}
						}
					}
					document.body.appendChild(script);
				}
			} catch (err) {
				this._log(`Error initializing chat script: ${err}`, 'error');
			}
		},
		showChat: (sku: string) => {
			if (typeof window !== 'undefined' && window.shoply) {
				window.shoply.showMiniChat?.({ sku });
			}
		},
		hideChat: () => {
			if (typeof window !== 'undefined' && window.shoply) {
				window.shoply.showMiniChat?.(null);
			}
		},
	};

	dev: SDKTypes.ShoplySDKDevMethods = {
		openVisualEditor: async (
			type: 'banner' | 'slider' | 'category',
			position: string,
			lang?: string,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => {
			if (!type || !['banner', 'slider', 'category'].includes(type) || !position) {
				this._log('Invalid parameters for openVisualEditor method. Make sure to include all arguments: type position, and optionally lang', 'error');
				return 'Invalid parameters for openVisualEditor method. Make sure to include all arguments: type position, and optionally lang';
			}

			if (typeof window !== 'undefined') {
				const location = window.location;
				const response = await this.fetch<{
					url: string;
				}>({
					method: 'POST',
					url: '/dev/open-visual-editor',
					data: {
						type,
						lang: lang || (config?.lang || this.config.lang),
						position,

						origin: location.origin,
						href: location.href,
					},
					config,
				});

				if (response.error) {
					this._log(response.error.message, 'error');
					return response.error.message;
				}

				if (response.data?.url) {
					window.location.replace(response.data.url);
				} else {
					this._log('Visual editor URL not received', 'error');
					return 'Visual editor URL not received';
				}
			} else {
				this._log('Visual editor is only available in browser environment', 'error');
				return 'Visual editor is only available in browser environment';
			}
		}
	}
};

export default ShoplySDK;