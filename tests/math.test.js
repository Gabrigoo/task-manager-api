const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');

test('Should calculate total with tip', () => {
  const total = calculateTip(10, .3);
  expect(total).toBe(13);
});

test('Should calculate total with default tip', () => {
  const total = calculateTip(10);
  expect(total).toBe(11);
});

test('Should convert fahrenheit to celsius', () => {
  const converted = fahrenheitToCelsius(32);
  expect(converted).toBe(0);
});

test('Should convert celsius to fahrenheit', () => {
  const converted = celsiusToFahrenheit(0);
  expect(converted).toBe(32);
});
// done signifies that this case is async
test('Async test demo', (done) => {
  setTimeout(() => {
    expect(2).toBe(2);
    done();
  }, 1000)
});
// Async testing
test('Should add two number', (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  })
})
// Async testing 2
test('Should add two numbers async/await', async () => {
  const sum = await add(10, 22);
  expect(sum).toBe(32);
})