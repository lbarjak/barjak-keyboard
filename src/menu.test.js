const menu = require('./menu');

test('should return the correct choice for option 1', () => {
	expect(menu.choose(1)).toBe('You selected option 1');
});

test('should return the correct choice for option 2', () => {
	expect(menu.choose(2)).toBe('You selected option 2');
});

test('should return an error message for an invalid option', () => {
	expect(menu.choose(3)).toBe('Invalid option');
});