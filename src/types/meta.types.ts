import type * as GlobalTypes from './global.types';

export interface VisualsInterface {
    _id: string;
    image: {
        desktop: GlobalTypes.AssetInteface;
        tablet: GlobalTypes.AssetInteface;
        mobile: GlobalTypes.AssetInteface;
    };
    position: string;
    link?: string;
    alt?: string;
}

export interface PaymentMethodInterface {
    label: string;
    value: string;
}

export interface ShippingMethodInterface {
    label: string;
    value: string;

    cost: number;
    freeFrom: number;
    countries: {
        label: string;
        value: string;
    }[];
}

export interface MiniPageInterface {
    title: string;
    slug: string;
    type: GlobalTypes.PageTypesEnum;
}

export interface PageInterface {
    title: string;
    slug: string;
    type: GlobalTypes.PageTypesEnum;
    content: string;
    seo?: {
        title?: string;
        description?: string;
        image?: GlobalTypes.AssetInteface;
    }
}

export interface ContactInterface {
    address?: {
        name?: string;
        street?: string;
        city?: string;
        zip?: number;
    };
    phones?: string[];
    emails?: string[];
}

export interface SocialsInterface {
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
}