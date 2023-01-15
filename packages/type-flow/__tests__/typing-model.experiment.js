const { ModelType }  = require('../src');

const Role = ModelType.Object({
  name: String,
  privileges: ModelType.Array({
    permissions: ModelType.Array(String),
    rights: ModelType.Array(String),
  }),
});

const User = ModelType.Object({
  username: String,
  passwordHash: String,
  salt: String,
  role: [Role, ModelType.default(null)],
  age: [String, Number, ModelType.default("0")],
});

const inputUser1 = {
  username: "rhie-coder",
  passwordHash: "96CAE35CE8A9B0244178BF28E4966C2CE1B8385723A96A6B838858CDD6CA0A1E",
  salt: "keyboard cat",
}

const inputRole1 = {
  name: "anonymous",
  privileges: [
    {
      permissions: ["GET", "POST", "PUT", "DELETE"],
      rights: [
        "board:$user:$id",
        "board:$user:list", 
        "profile:$user",
      ]
    },
    {
      permissions: ["GET"],
      rights: [
        "board:list",
        "home",
        "login",
      ]
    }
  ]
}

test('CHECK: parse', () => {

});

test('CHECK: valid', () => {

});