import type * as GlobalTypes from './global.types';

export interface VisualsInterface {
    _id: string;
    contentType?: 'image' | 'text';
    image?: {
        desktop: GlobalTypes.AssetInteface;
        tablet: GlobalTypes.AssetInteface;
        mobile: GlobalTypes.AssetInteface;
    };
    position: string;
    link?: string;
    alt?: string;
    text?: {
        desktop?: string;
        tablet?: string;
        mobile?: string;
    };
}

export interface PaymentMethodInterface {
    label: string;
    value: string;
}

export interface CountryInterface {
    label: string;
    value: string;
}

export interface ShippingMethodInterface {
    label: string;
    value: string;

    cost: number;
    freeShippingFrom: number;
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

export interface LangsInterface {
    langs: string[];
    defaultLang: string;
}

export interface SeoInterface {
    title?: string | Record<string, string>;
    description?: string | Record<string, string>;
    image?: GlobalTypes.AssetInteface;
}

export interface ColorSchemaInterface {
    id: string;
    background: { primary: string; secondary: string; tertiary: string; accent: string };
    text: { primary: string; secondary: string; tertiary: string; accent: string };
    white: string;
    black: string;
    red: string;
    green: string;
    blue: string;
    border: string;
    ligthGray: string;
    gray: string;
    darkGray: string;
}

export interface FontsInterface {
    title?: string;
    text?: string;
}

export interface SiteConfigInterface {
    name: string;
    template: string;
    logo?: GlobalTypes.AssetInteface;
    footerLogo?: GlobalTypes.AssetInteface;
    favicon?: GlobalTypes.AssetInteface;
    seo: SeoInterface;
    colorScheme: ColorSchemaInterface;
    fonts: FontsInterface;
}

export type CurrencyEnum = 'AFN' | 'EUR' | 'ALL' | 'DZD' | 'USD' | 'AOA' | 'XCD' | 'ARS' | 'AMD' | 'AWG' | 'AUD' | 'AZN' | 'BSD' | 'BHD' | 'BDT' | 'BBD' | 'BYN' | 'BZD' | 'XOF' | 'BMD' | 'BTN' | 'INR' | 'BOB' | 'BOV' | 'BAM' | 'BWP' | 'NOK' | 'BRL' | 'BND' | 'BGN' | 'BIF' | 'CVE' | 'KHR' | 'XAF' | 'CAD' | 'KYD' | 'CLF' | 'CLP' | 'CNY' | 'COP' | 'COU' | 'KMF' | 'CDF' | 'NZD' | 'CRC' | 'CUC' | 'CUP' | 'ANG' | 'CZK' | 'DKK' | 'DJF' | 'DOP' | 'EGP' | 'SVC' | 'ERN' | 'ETB' | 'FKP' | 'FJD' | 'XPF' | 'GMD' | 'GEL' | 'GHS' | 'GIP' | 'GTQ' | 'GBP' | 'GNF' | 'GYD' | 'HTG' | 'HNL' | 'HKD' | 'HUF' | 'ISK' | 'IDR' | 'XDR' | 'IRR' | 'IQD' | 'ILS' | 'JMD' | 'JPY' | 'JOD' | 'KZT' | 'KES' | 'KPW' | 'KRW' | 'KWD' | 'KGS' | 'LAK' | 'LBP' | 'LSL' | 'ZAR' | 'LRD' | 'LYD' | 'CHF' | 'MOP' | 'MKD' | 'MGA' | 'MWK' | 'MYR' | 'MVR' | 'MRU' | 'MUR' | 'XUA' | 'MXN' | 'MXV' | 'MDL' | 'MNT' | 'MAD' | 'MZN' | 'MMK' | 'NAD' | 'NPR' | 'NIO' | 'NGN' | 'OMR' | 'PKR' | 'PAB' | 'PGK' | 'PYG' | 'PEN' | 'PHP' | 'PLN' | 'QAR' | 'RON' | 'RUB' | 'RWF' | 'SHP' | 'WST' | 'STN' | 'SAR' | 'RSD' | 'SCR' | 'SLE' | 'SGD' | 'XSU' | 'SBD' | 'SOS' | 'SSP' | 'LKR' | 'SDG' | 'SRD' | 'SZL' | 'SEK' | 'CHE' | 'CHW' | 'SYP' | 'TWD' | 'TJS' | 'TZS' | 'THB' | 'TOP' | 'TTD' | 'TND' | 'TRY' | 'TMT' | 'UGX' | 'UAH' | 'AED' | 'USN' | 'UYI' | 'UYU' | 'UZS' | 'VUV' | 'VEF' | 'VED' | 'VND' | 'YER' | 'ZMW' | 'ZWL'

export interface CurrencyDataInterface {
    currency: CurrencyEnum;
    currencies: {
        label: CurrencyEnum;
        value: CurrencyEnum;
    }
}

export interface ProductsSitemapDataInterface {
    _id: string;
    name: Record<string, string>;
    sku: string;
    images: GlobalTypes.AssetInteface[];
    updatedAt: string;
}

export interface CategoriesSitemapDataInterface {
    _id: string;
    name: Record<string, string>;
    breadcrumb: Record<string, string>;
    image?: GlobalTypes.AssetInteface | null;
    updatedAt: string;
}

export interface PagesSitemapDataInterface {
    _id: string;
    lang: string;
    title: string;
    slug: string;
    image?: GlobalTypes.AssetInteface | null;
    updatedAt: string;
}

export interface SitemapDataInterface {
    products?: ProductsSitemapDataInterface[];
    categories?: CategoriesSitemapDataInterface[];
    pages?: PagesSitemapDataInterface[];
}

export type SitemapDataTypeEnum = 'products' | 'categories' | 'pages';

export interface NewsletterMailingListEntryInterface {
    type: 'regular' | 'test';
    email: string;
    lang: string;
    isActive: boolean;
}

export interface SendContactMessageInputDataInterface {
    name: string;
    email: string;
    subject: string;
    message: string;
}