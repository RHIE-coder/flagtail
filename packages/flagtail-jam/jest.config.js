module.exports = {
  moduleNameMapper: {
    "#/(.*)": "<rootDir>/mock/$1",
  },
  setupFiles:["<rootDir>/setupJestEnv.js"],
}