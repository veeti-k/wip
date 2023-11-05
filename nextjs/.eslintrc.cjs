/** @type { import("eslint").Linter.FlatConfig[] } */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: { project: ['./tsconfig.json'] },
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
