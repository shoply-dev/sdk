import axios from 'axios';

import type { ShoplySDKConfig } from '../types/config.types';
import type { CreateAxiosDefaults } from 'axios';
import type { ShoplySDKContext } from '../types/context.types';

export const transformShoplyConfigToAxiosConfig = (
	config: ShoplySDKConfig,
	context: ShoplySDKContext
): CreateAxiosDefaults => {

	const accessToken = config?.accessToken ? (
		config.accessToken
	) : config?.getAccessToken ? (
		config.getAccessToken()
	) : context?.accessToken ? (
		context.accessToken
	) : undefined;

	const obj: CreateAxiosDefaults = {
		baseURL: `${config.baseURL.replace(/\/$/, '')}/sdk/${config.version ?? 'v1'}`,
		timeout: config.timeout ?? 10000,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Origin': typeof window === 'undefined' && config?.origin ? config.origin : undefined,
			'Authorization': accessToken ? `Bearer ${accessToken}` : undefined,
		},
		withCredentials: true,
		params: {
			lang: config.lang,
			pricelistId: config.pricelistId,
			skipTransform: config.skipTransform ? 'true' : undefined,
			userId: config.userId ?? config.getUserId?.(),
		}
	};

	return obj;
}

export const createAxiosInstance = (
	config: ShoplySDKConfig,
	context: ShoplySDKContext
) => {
	return axios.create(transformShoplyConfigToAxiosConfig(config, context));
}

export const configureAxiosInterceptors = (
	axiosInstance: ReturnType<typeof axios.create>,
	config: ShoplySDKConfig,
	context: ShoplySDKContext,
	setNewTokens: (accessToken: string, refreshToken: string) => void
) => {
	axiosInstance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const refreshToken = config?.refreshToken ? (
				config.refreshToken
			) : config?.getRefreshToken ? (
				config.getRefreshToken()
			) : context?.refreshToken ? (
				context.refreshToken
			) : undefined;
			if (!refreshToken) return Promise.reject(error);

			const prev = error?.config;
			if (error?.response?.status === 418 && prev && !prev._sent) {
				prev._sent = true;
				const newAccessToken = await refreshAccessToken(refreshToken, config, context, setNewTokens);
				if (!newAccessToken) return Promise.reject(error);

				prev.headers.Authorization = `Bearer ${newAccessToken}`;
				return axiosInstance(prev);
			}

			return Promise.reject(error);
		}
	);

	return axiosInstance;
}

const refreshAccessToken = async (
	refreshToken: string,
	config: ShoplySDKConfig,
	context: ShoplySDKContext,
	setNewTokens: (accessToken: string, refreshToken: string) => void
) => {
	const instance = createAxiosInstance(config, context);
	try {
		const response = await instance.post('/users/refresh', {
			refreshToken,
		});

		if (response?.data?.data?.accessToken) {
			setNewTokens(response.data.data.accessToken, response.data.data.refreshToken);

			return response.data.data.accessToken as string;
		}
	} catch(err) {}

	return null;
}