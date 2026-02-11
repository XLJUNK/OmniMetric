import { LangType } from './dictionary';

// Terms Interfaces
export interface TermsListItem {
    title?: string;
    desc?: string;
}

export interface TermsSection {
    title: string;
    content?: string;
    list?: (string | TermsListItem)[];
    note?: string;
    footer?: string;
    sources?: string[];
    disclaimer?: string;
    subsections?: TermsSection[];
}

export interface TermsData {
    title: string;
    lastUpdated: string;
    criticalDisclaimer: {
        title: string;
        mainText: string;
        list: string[];
        acknowledgment: string;
    };
    sections: TermsSection[];
    contact: {
        title: string;
        text: string;
    };
    legalFramework: string;
}

// Privacy Interfaces
export interface PrivacyListItem {
    label?: string;
    desc?: string;
    title?: string;
    link?: string;
    text?: string;
    link2?: string;
    text2?: string;
}

export interface PrivacySubSection {
    title: string;
    list?: (string | PrivacyListItem)[];
    content?: string;
}

export interface PrivacyService {
    name: string;
    desc?: string;
    footer?: string;
}

export interface PrivacySection {
    title: string;
    content?: string;
    subsections?: PrivacySubSection[];
    services?: PrivacyService[];
    list?: PrivacyListItem[];
    footer?: string;
}

export interface PrivacyData {
    title: string;
    lastUpdated: string;
    adsensePolicy: {
        title: string;
        content: string;
        cookie_notice: string;
        more_info: string;
    };
    sections: PrivacySection[];
    contact: {
        title: string;
        text: string;
    };
    legalFramework: string;
}

// Data Imports
import termsEn from './terms-en.json';
import termsJp from './terms-jp.json';
import termsDe from './terms-de.json';
import termsFr from './terms-fr.json';
import termsCn from './terms-cn.json';
import termsEs from './terms-es.json';
import termsHi from './terms-hi.json';
import termsId from './terms-id.json';
import termsAr from './terms-ar.json';

import privacyEn from './privacy-en.json';
import privacyJp from './privacy-jp.json';
import privacyDe from './privacy-de.json';
import privacyFr from './privacy-fr.json';
import privacyCn from './privacy-cn.json';
import privacyEs from './privacy-es.json';
import privacyHi from './privacy-hi.json';
import privacyId from './privacy-id.json';
import privacyAr from './privacy-ar.json';

const TERMS_MAP: Record<LangType, any> = {
    EN: termsEn,
    JP: termsJp,
    DE: termsDe,
    FR: termsFr,
    CN: termsCn,
    ES: termsEs,
    HI: termsHi,
    ID: termsId,
    AR: termsAr,
};

const PRIVACY_MAP: Record<LangType, any> = {
    EN: privacyEn,
    JP: privacyJp,
    DE: privacyDe,
    FR: privacyFr,
    CN: privacyCn,
    ES: privacyEs,
    HI: privacyHi,
    ID: privacyId,
    AR: privacyAr,
};

export function getTermsData(lang: LangType): TermsData {
    return (TERMS_MAP[lang] || termsEn) as TermsData;
}

export function getPrivacyData(lang: LangType): PrivacyData {
    return (PRIVACY_MAP[lang] || privacyEn) as PrivacyData;
}
