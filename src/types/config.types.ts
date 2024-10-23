

export interface ShoplySDKConfig {
	/** Base URL for request(s). Should be in the format of: https://api.[your-slug].shoply.[tld] */
	baseURL: string;

	/** Version of API to target. Will list out all available versions. Default is v1 */
	version?: 'v1';

	/** Origin header for request(s). If typeof window is not undefined - will be ignored. Set only for requests coming from server */
	origin?: string;

	/** Timeout for request(s) in MS. Default is 10 seconds */
	timeout?: number;

	/** Language for request(s). Default is whatever lang is set for store */
	lang?: string;

	/** All requests transform multilang fields to simple fields. To avoid this and to get untransformed items set this to true */
	skipTransform?: true;

	/** Id of pricelist which will be used with request(s). Defaults to pricelist set for store or default regular pricelist for entire shop. We recommend leaving this empty and instead switching pricelist in Shoply Dashboard, as needed. */
	pricelistId?: string;

	/** User id for cart operations. If not set, and neither is the getter,  will be picked up from internal context or cookies */
	userId?: string;

	/** Function that will be runned to get userId for cart */
	getUserId?: () => string;

	/** Access token for request(s). If not set, and neither is the getter, will be picked up from internal context or cookies */
	accessToken?: string;

	/** Function that will be runned to get accessToken */
	getAccessToken?: () => string;

	/** Refresh token for request(s). If not set, and neither is the getter, will be picked up from internal context or cookies */
	refreshToken?: string;

	/** Function that will be runned to get refreshToken */
	getRefreshToken?: () => string;
}

export interface ShoplySDKConfigSetter extends Omit<ShoplySDKConfig, 'baseURL'> {
	/** Update baseURL for all requests. */
	baseURL?: string;
}

export interface ShoplySDKConfigForSingleRequest extends Omit<ShoplySDKConfig, 'baseURL' | 'getUserId' | 'getAccessToken' | 'getRefreshToken'> {
	/** Update baseURL for single request. */
	baseURL?: string;
};

export interface ShoplySDKFetchRequest {
	/** URL for request */
	url: string;
	/** Method for request */
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Data for request */
	data?: any;
	/** Params for request */
	params?: any;
	/** Config for single request */
	config?: ShoplySDKConfigForSingleRequest;
}