import { writable } from "svelte/store";

export const isFileUploadedValidationComplete = writable(false);

export const isPurchaseInformationValidationComplete = writable(true);
export const isPersonalInformationValidationComplete = writable(true);
export const isQuestionsValidationComplete = writable(true);
export const isTermsValidationComplete = writable(false);
