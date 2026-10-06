import { PACKAGE_NAME } from './constants.js';

/** The code a user pastes into their app: the import plus the component tag. */
export function buildSnippet(name: string, { direct }: { direct: boolean }): string {
	const importLine = direct
		? `import ${name} from '${PACKAGE_NAME}/${name}.svelte';`
		: `import { ${name} } from '${PACKAGE_NAME}';`;

	return `<script>\n\t${importLine}\n</script>\n\n<${name} />`;
}
