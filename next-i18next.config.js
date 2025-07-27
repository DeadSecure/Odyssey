// // next-i18next.config.js
// /** @type {import('next-i18next').UserConfig} */
// module.exports = {
//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en', 'fa'],
//     localeDetection: true,
//   },
// };
// next-i18next.config.js
/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fa'],
    localeDetection: true,
  },
  localePath: typeof window === 'undefined'
    ? require('path').resolve('./public/locales')
    : '/locales', // needed for server vs client build
};
