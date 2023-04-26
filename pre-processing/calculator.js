const adder = require("../modules/adder");
const subtractor = require("../modules/subtractor");
const multiplier = require("../modules/multiplier");
const divider = require("../modules/divider");

module.exports = {
  add: function (num1, num2){
  return adder(num1, num2)
},
  subtract: function (num1, num2) {
  return subtractor(num1, num2);
  },
  multiply: function (num1, num2) {
  return multiplier(num1, num2);
  },
  divide: function (num1, num2) {
  return divider(num1, num2);
  },
};
