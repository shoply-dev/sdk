import type { AxiosError } from "axios";
import type { ShoplyRequestError } from "../types/sdk.types";

export const defaultServerErrorMessage = 'Something went wrong and Shoply servers have failed to execute SDK request! Please check your configuration, dashboard and server availability, and try again later.';

export const defaultClientErrorMessage = 'An error has occurred and your request cound not reach Shoply servers! Please check your internet connection and request configuration, and try again.';

export const defaultConfigErrorMessage = 'An error has occurrend in setting up the request and the request was not sent to Shoply servers! Please check your configuration and our documentation!';

export const handleAxiosError = (err: AxiosError): ShoplyRequestError => {
	let message = defaultConfigErrorMessage;
	let status = 500;
	let data = null;

	if (err?.response) {
		if (err.response.status) status = err.response.status;
		if (err.response.data) {
			let _data = err.response.data as any;
			if (_data?.message && typeof _data.message === 'string') message = _data.message;
			else message = defaultServerErrorMessage;
			if (_data?.data) data = _data.data
		}
	} else if (err?.request) {
		message = defaultClientErrorMessage;
		if (err.request?.status) status = err.request.status;
	};

	if (!message) message = defaultConfigErrorMessage;

	return {
		status,
		message,
		data,
		isInactive: (status === 401 && message === 'This store is not active!')
	};
}