module.exports = {
  "env": {
    "es6": true
    "mocha": true
  },
  "extends": ["vue"],
  "plugins": [
    "promise",
    "mocha",
    "chai-expect"
  ],
  "rules": {
    "mocha/no-exclusive-tests": "error"
  }
}
