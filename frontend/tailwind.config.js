// tailwind.config.js
const { colors: defaultColors } = require('tailwindcss/defaultTheme')

const colors = {
    ...defaultColors,
    ...{
        "custom-green": {
            "500": "#19B394",
        },
    },
}

module.exports = {
    "theme": {
        "colors": colors,
    }
};