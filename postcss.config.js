//import purgecss from '@fullhuman/postcss-purgecss';
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
    plugins: [
        require('autoprefixer'),
        purgecss({
            content: ['./**/*.html,', './**/*.js'],
            css: ['./**/*.css'],
        }),
    ],
};
