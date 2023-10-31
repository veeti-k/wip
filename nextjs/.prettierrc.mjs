/** @type { import('prettier').Config } */
export default {
	singleQuote: true,
	htmlWhitespaceSensitivity: 'ignore',
	endOfLine: 'auto',
	tabWidth: 4,
	useTabs: true,
	overrides: [
		{
			files: '*.{yml, yaml}',
			options: {
				tabWidth: 2,
			},
		},
	],
};
