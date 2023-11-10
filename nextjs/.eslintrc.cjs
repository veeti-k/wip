/** @type { import("eslint").Linter.FlatConfig[] } */
module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@next/next/recommended',
		'next/core-web-vitals',
	],
	ignorePatterns: ['node_modules', '*.cjs', '*.js', '*.d.ts'],
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{ fixStyle: 'inline-type-imports', disallowTypeAnnotations: false },
		],
	},
};
