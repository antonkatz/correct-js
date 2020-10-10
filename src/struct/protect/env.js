export const IS_PROD = process?.env?.NODE_ENV === 'production' ||
    process?.env?.CORRECT_JS_ENV === 'production'
