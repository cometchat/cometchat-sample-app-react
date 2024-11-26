import { CometChatLocalize } from '@cometchat/chat-uikit-react';
import english from '../locales/en/en.json';
import german from '../locales/de/de.json';
import spanish from '../locales/es/es.json';
import arabic from '../locales/ar/ar.json';
import french from '../locales/fr/fr.json';
import hindi from '../locales/hi/hi.json';
import hungarian from '../locales/hu/hu.json';
import lithuanian from '../locales/lt/lt.json';
import malay from '../locales/ms/ms.json';
import portuguese from '../locales/pt/pt.json';
import russian from '../locales/ru/ru.json';
import swedish from '../locales/sv/sv.json';
import chinese from '../locales/zh/zh.json';
import chineseTaiwan from '../locales/zh-tw/zh-tw.json';

/**
 * Initializes the localization for both the sample app and the UI Kit.
 * 
 * This function sets up the localization system by determining the language to be used.
 * It uses the provided `language` parameter if available; otherwise, it defaults to the browser's language settings.
 *
 * @param {string} [language] - The language code to be used for localization (e.g., 'en', 'fr', 'es'). If not provided, the browser's default language is used.
 *
 * @example
 * // Initialize localization with a specific language
 * setupLocalization('fr'); // Sets language to French
 *
 * @example
 * // Initialize localization using the browser's default language
 * setupLocalization(); // Defaults to the browser's language
*/
export function setupLocalization(language?:string){
    let resourcesJson =  {
        en:english,
        de:german,
        es:spanish,
        ar:arabic,
        fr:french,
        hi:hindi,
        hu:hungarian,
        lt:lithuanian,
        ms:malay,
        pt:portuguese,
        ru:russian,
        sv:swedish,
        zh:chinese,
        "zh-tw": chineseTaiwan,
      }
    CometChatLocalize.init(language, resourcesJson);
}