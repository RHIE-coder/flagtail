const JSONCooker  = require('../src');

const MOCK_DATA = {
  apple: 10,
  banana: 20,
  cider: 3.14,
  digitSet: {
    apple: "very sweet",
    cider: [11, 21, 3.14, { inside: "sugar" }],
    user: {
      name: "rhie",
      area: [
        "asia",
        {
          message: "hello world",
          binary: [1, 11, 101, 1010],
        },
        "seoul" 
      ],
    },
  }
}

test("1 is 1", () => {
  expect(1).toBe(1);
  expect(5).toBe(5);
  console.log(JSONCooker);
});