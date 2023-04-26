const calculator = require("./pre-processing/calculator");



// Reading a file
fs.readFile("myfile.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Writing a file
fs.writeFile("myfile.txt", "Hello, world!", (err) => {
  if (err) throw err;
  console.log("File written!");
});


const num1 = 10;
const num2 = 5;

console.log(`Addition of ${num1} and ${num2}:`, calculator.add(num1, num2));
console.log(`Subtraction of ${num1} and ${num2}:`, calculator.subtract(num1, num2));
console.log(`Multiplication of ${num1} and ${num2}:`, calculator.multiply(num1, num2));
console.log(`Division of ${num1} and ${num2}:`, calculator.divide(num1, num2));

// console.log(`Addition of ${num1} and ${num2}:`, adder(num1, num2));
// console.log(`Subtraction of ${num1} and ${num2}:`, subtractor(num1, num2));
// console.log(`Multiplication of ${num1} and ${num2}:`, multiplier(num1, num2));
// console.log(`Division of ${num1} and ${num2}:`, divider(num1, num2));
