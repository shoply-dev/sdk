import * as Axios from './services/axios.service';
import * as Validator from "./utils/validators.utils";
import * as Errors from "./services/error.service";
import { AxiosError } from 'axios';

import type * as  ConfigTypes from "./types/config.types";
import type { AxiosInstance } from "axios";
import type * as UserTypes from './types/users.types';
import type * as ContextTypes from './types/context.types';
import type * as CartTypes from './types/cart.types';
import type * as SDKTypes from './types/sdk.types';


export class ShoplySDK {
	private axios: AxiosInstance;
	private context: ContextTypes.ShoplySDKContext = {};

	constructor(
		private config: ConfigTypes.ShoplySDKConfig,
		private debug: boolean = false
	) {
		if (!this.config.baseURL || !Validator.isValidUrl(this.config.baseURL)) throw new Error('Invalid baseURL');

		this.axios = Axios.createAxiosInstance(this.config);
	}

	private _log = (msg: string, type: 'log' | 'warn' | 'error' = 'log') => {
		if (this.debug) console[type](`ShoplySDK: ${msg}`);
	};

	internal: SDKTypes.ShoplySDKInternalMethods = {
		setConfig: (config: ConfigTypes.ShoplySDKConfigSetter) => {
			this.config = {
				...this.config,
				...config,
			}

			this.axios = Axios.createAxiosInstance(this.config as any);
		},

		getConfig: () => this.config,

		getContext: () => this.context,
	}

	private prepareFetch = (
		singleConfig: ConfigTypes.ShoplySDKConfigForSingleRequest = {}
	) => {
		const config = {
			...this.config,
			...singleConfig,
		};
		const axiosConfig = Axios.transformShoplyConfigToAxiosConfig(config);
		return axiosConfig;
	}

	// TODO - implement auto refresh token
	private fetch = async <T extends any>(
		obj: ConfigTypes.ShoplySDKFetchRequest
	): Promise<SDKTypes.ShoplySDKResponse<T>> => {
		try {
			const config = this.prepareFetch(obj.config);

			const response = await this.axios({
				...config as any,
				url: obj.url,
				method: obj.method,
				data: obj.data,
				params: obj.params,
			});

			if (response?.status && response.status >= 200 && response.status < 300 && response.data) {
				return {
					data: response.data.data,
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
	}

	users: SDKTypes.ShoplySDKUserMethods = {
		register: (
			data: UserTypes.RegisterUserRequestBody,
			config?: ConfigTypes.ShoplySDKConfigForSingleRequest
		) => this.fetch<{ user: UserTypes.User }>({
			url: '/users/register',
			method: 'POST',
			data,
			config
		}),

		login: async (
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
				this.context.user = response.data.user;
				if (typeof response.data.cart === 'object') this.context.cart = response.data.cart;
				this.context.accessToken = response.data.accessToken;
				this.context.refreshToken = response.data.refreshToken;
			}

			return response;
		},

		logout: async (
			refreshToken?: string,
		) => this.fetch<{}>({
			url: '/users/logout',
			method: 'POST',
			data: refreshToken ? { refreshToken } : undefined,
		}),

		verify: async (
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
				this.context.user = response.data.user;
				if (typeof response.data.cart === 'object') this.context.cart = response.data.cart;
			}

			return response;
		},
	}
};

export default ShoplySDK;