
export interface UserAddress {
	/** Country - should be one of available countries for shipping */
	country?: string;
	/** Region - if exists */
	region?: string;
	/** City */
	city?: string;
	/** Zip number */
	zip?: string;
	/** Street */
	street?: string;
}

export interface User {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	lang: string;
	address?: UserAddress;
	emailIsVerified: boolean;
}

export interface RegisterUserRequestBody {
	/** First and Last name */
	name: string;
	/** Email address */
	email: string;
	/** Password */
	password: string;
	/** Phone number */
	phone?: string;
	/** Repeat password - if supplied a check on whether it's the same as password is made. */
	repeatPassword?: string;
	/** Language for user - if supplied and not one of available languages, a 400 error will be returned! Defaults to default lang for store */
	lang?: string;
	/** User address */
	address?: UserAddress;
}

export interface LoginUserRequestBody {
	/** Email address */
	email: string;
	/** Password */
	password: string;
	/** Remember current user - will make tokens with older expiration dates if true */
	rememberMe?: boolean;
}