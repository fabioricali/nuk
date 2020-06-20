module.exports = {
    TESTING: '__testing__',
    VENDORS_FOLDER: 'vendors',
    PROCESSING_FOLDER: '__processing__',
    REGEX_GET_ARGS: /([\w./@-]+)|\s+(-[d])\s+([\w-.]+)/g,
    REGEX_GET_INFO_FROM_TGZ: /([\w-\d.]+)-([\d.-]+.*)\.tgz/,
    NUK_JSON_FILENAME: 'nuk.json',
    NUK_JSON_LOCK_FILENAME: 'nuk-lock.json',
    EXCLUDE_FILES: ['package.json', 'readme.md', 'license', 'changelog.md', 'history.md'],
    BASE_API_LIST: 'https://data.jsdelivr.com/v1/package/npm/'
};
