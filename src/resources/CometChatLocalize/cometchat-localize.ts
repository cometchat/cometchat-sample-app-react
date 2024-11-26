import translationAR from "./resources/ar/translation.json";
import translationDE from "./resources/de/translation.json";
import translationEN from "./resources/en/translation.json";
import translationES from "./resources/es/translation.json";
import translationFR from "./resources/fr/translation.json";
import translationHI from "./resources/hi/translation.json";
import translationMS from "./resources/ms/translation.json";
import translationPT from "./resources/pt/translation.json";
import translationRU from "./resources/ru/translation.json";
import translationZH from "./resources/zh/translation.json";
import translationZHTW from "./resources/zh-tw/translation.json";
import translationSV from "./resources/sv/translation.json";
import translationLT from "./resources/lt/translation.json";
import translationHU from "./resources/hu/translation.json";

/**
 * The `CometChatLocalize` class handles localization for the CometChat application.
 * It provides functionality to detect the user's browser language settings and
 * set the application's language accordingly.
 */
class CometChatLocalize {
	/**Properties and constants */
	static fallbackLanguage = "en";
	static locale: string;
	static rtlLanguages = ["ar"];
	static direction = Object.freeze({
		ltr: "ltr",
		rtl: "rtl",
	});
	static translations = {
		ar: translationAR,
		de: translationDE,
		en: translationEN,
		es: translationES,
		fr: translationFR,
		hi: translationHI,
		ms: translationMS,
		pt: translationPT,
		ru: translationRU,
		zh: translationZH,
		"zh-tw": translationZHTW,
		sv: translationSV,
		lt: translationLT,
		hu: translationHU
	};
	/**
	 * Needs to be called at the start of the application in order to set the language
	 * @param {Object} - language & resources
	 */
	
  /**
   * Initializes localization with the specified language and custom resources.
   * @param {string} [language=""] - The language code to set.
   * @param {object} [resources={}] - Custom translations to override defaults.
   */
	static init = (language: string = "", resources: object = {}) => {
		if (language) {
			CometChatLocalize.locale = language;
		} else {
			CometChatLocalize.setDefaultLanguage();
		}
		/**Override resources */
		if (resources) {
			for (const resource in resources) {
				/**Add to the original array of translations if language code is not found */
				if (!(CometChatLocalize as any).translations[resource]) {
					(CometChatLocalize as any).translations[resource] = (resources as any)[resource];
				} else {
					for (const key in ((resources as any)[resource])) {
						(CometChatLocalize as any).translations[resource][key] = (resources as any)[resource][key];
					}
				}
			}
		}
	};
	/**
	 * Returns the browser language
	 * @returns {String} browser langauge i.e. en-US
	 */
	static getBrowserLanguage = () => {
		return (navigator.languages && navigator.languages[0]) || navigator.language;
	};
	/**
	 * Returns the language code
	 * @returns {String} language code i.e. en
	 */
	static getLanguageCode = () => {
		const languageCode = CometChatLocalize.getBrowserLanguage().toLowerCase();
		// check if the language set in the browser has hyphen(-), if yes split and take the first element of the array
		if (languageCode.indexOf("-") !== -1 && languageCode !== "zh-tw") {
			return languageCode.split("-")[0];
		}
		return languageCode;
	};
	/**
	 * Returns the active language. Return fallback language if translation is not available for the active language
	 * @returns {String} active language
	 */
	static getLocale = () => {
		let language = CometChatLocalize.locale;
		if (!CometChatLocalize.translations.hasOwnProperty(language)) {
			language = CometChatLocalize.fallbackLanguage;
		}
		return language;
	};
	/**
	 * Set the active language
	 * @param {String} language
	 */
	static setLocale = (language: string) => {
		CometChatLocalize.locale = language;
	};
	/**
	 * Accepts the string to localize and return the localized string
	 * @param {String} str
	 * @returns {String} localized str
	 */
	static localize(str: string) {
		let language = CometChatLocalize.getLocale();
		return (CometChatLocalize as any).translations[language][str];
	}
	/**
	 * Sets the default lannguage if no language is passed in init method
	 */
	static setDefaultLanguage = () => {
		// get the active language
		const activeLanguage = CometChatLocalize.getLocale();

		// get the browser language code
		let browserLanguageCode = CometChatLocalize.getLanguageCode();

		// if there is no active language or active language is different from browser language, update active language with browser language
		if (!activeLanguage || activeLanguage !== browserLanguageCode) {
			CometChatLocalize.setLocale(browserLanguageCode);
		}
	};
	/**
	 * Returns true if the active language is rtl otherwise return false
	 * @returns {Boolean} whether the language is rtl or not
	 */
	static isRTL = () => {
		if (CometChatLocalize.rtlLanguages.includes(CometChatLocalize.getLocale())) {
			return true;
		}
		return false;
	};
	/**
	 * Returns rtl or ltr based on the active language
	 * @returns {String} the direction of the active langauge
	 */
	static getDir = () => {
		if (CometChatLocalize.rtlLanguages.includes(CometChatLocalize.getLocale())) {
			return CometChatLocalize.direction.rtl;
		}
		return CometChatLocalize.direction.ltr;
	};
}
const localize = (str: string) => CometChatLocalize.localize(str);
export { CometChatLocalize, localize };
