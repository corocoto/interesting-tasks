module.exports = {
  verbose: true,
  roots: [
    "./packages/"
  ],
  collectCoverageFrom: [
    "<rootDir>/**/*.{js,ts}",
    "!<rootDir>/**/*.d.ts"
  ],
  testMatch: [
    "<rootDir>/**/__tests__/**/*.{js,ts}",
    "<rootDir>/**/*.{spec,test}.{js,ts}"
  ],
  modulePaths: [],
  moduleFileExtensions: [
    "js",
    "ts",
  ]
};
