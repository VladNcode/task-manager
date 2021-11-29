const { calcTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../math');

test('Should calculate total with tip', () => {
  const total = calcTip(10, 0.3);

  expect(total).toBe(13);

  // if (total !== 13) throw new Error(`Total should be 13, instead got ${total}`);
});

test('Should calculate total with tip without second arg provided', () => {
  const total = calcTip(10);

  expect(total).toBe(12.5);
});

test('Should convert -40F to -40C', () => {
  const temp = fahrenheitToCelsius(-40);

  expect(temp).toBe(-40);
});

test('Should convert -40C to -40F', () => {
  const temp = celsiusToFahrenheit(-40);

  expect(temp).toBe(-40);
});
