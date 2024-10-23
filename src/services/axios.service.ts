import axios from 'axios';

import type { ShoplySDKConfig } from '../types/config.types';
import type { CreateAxiosDefaults } from 'axios';

export const transformShoplyConfigToAxiosConfig = (
	config: ShoplySDKConfig
): CreateAxiosDefaults => {
	const obj: CreateAxiosDefaults = {
		baseURL: `${config.baseURL.replace(/\/$/, '')}/sdk/${config.version ?? 'v1'}`,
		timeout: config.timeout ?? 10000,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Origin': typeof window === 'undefined' && config?.origin ? config.origin : undefined,
		},
		withCredentials: true,
		params: {
			lang: config.lang,
			pricelistId: config.pricelistId,
			skipTransform: config.skipTransform ? 'true' : undefined,
			userId: config.userId ?? config.getUserId?.(),
		},
		data: {
			accessToken: config.accessToken ?? config.getAccessToken?.(),
			refreshToken: config.refreshToken ?? config.getRefreshToken?.(),
		}
	};

	return obj;
}

export const createAxiosInstance = (
	config: ShoplySDKConfig
) => {
	return axios.create(transformShoplyConfigToAxiosConfig(config));
}