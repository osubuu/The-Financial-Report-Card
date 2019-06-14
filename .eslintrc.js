module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb",
    "parser": "babel-eslint",
    "rules": {
        "indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }],
        "no-tabs": 0,
        "react/prop-types": 0,
        "react/jsx-indent": [2, "tab"],
        "react/jsx-indent-props": [2, "tab"],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "import/no-extraneous-dependencies": "off",
    }
}

