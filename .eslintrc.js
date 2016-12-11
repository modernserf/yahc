module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "standard",
        "plugin:import/recommended",
        "plugin:react/recommended",
    ],
    "plugins": [
        "standard",
        "promise",
        "import",
        "react",
    ],
    "rules": {
        'indent':['error',4],
        'comma-dangle':['error','always-multiline'],
        'quotes':['error','double'],
        'react/prop-types':['off'] // TODO
    }
};
