import { transform } from '@babel/standalone';
import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';


function removeImportsPlugin(): {} {
    const modulesToRemove = ['react', 'react-dom'];
    return {
        visitor: {
            ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
                if (modulesToRemove.includes(path.node.source.value)) {
                    path.remove();
                }
            },
        },
    };
}

function prefixReactHooksPlugin(): {} {
    const reactHooks = [
        'useState',
        'useEffect',
        'useContext',
        'useReducer',
        'useCallback',
        'useMemo',
        'useRef',
        'useImperativeHandle',
        'useLayoutEffect',
        'useDebugValue',
    ];

    return {
        visitor: {
            ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
                const source = path.node.source.value;
                if (source === 'react') {
                    const defaultSpecifier = path.node.specifiers.find(specifier =>
                        t.isImportDefaultSpecifier(specifier)
                    );

                    if (!defaultSpecifier) {
                        const reactIdentifier = t.identifier('React');
                        const importDefaultSpecifier = t.importDefaultSpecifier(reactIdentifier);
                        path.node.specifiers.push(importDefaultSpecifier);
                    }
                }
            },
            CallExpression(path: NodePath<t.CallExpression>) {
                const callee = path.node.callee;
                if (t.isIdentifier(callee) && reactHooks.includes(callee.name)) {
                    const reactIdentifier = t.identifier('React');
                    const hookIdentifier = t.identifier(callee.name);
                    const memberExpression = t.memberExpression(reactIdentifier, hookIdentifier);
                    path.node.callee = memberExpression;
                }
            },
        },
    };
}

const babelConfig = {
    presets: ['env', 'react'],
    plugins: [removeImportsPlugin(), prefixReactHooksPlugin()],
};

export function transpileCode(code: string): string {
    const output = transform(code, babelConfig);

    if (output.code) {
        return output.code;
    } else {
        throw new Error('No code was returned from Babel');
    }
}

export function formatBabelSyntaxError(error: Error): string {
    const errorLines = error.message.split('\n');
    const formattedErrorLines = errorLines.map((line, index) => {
        // Escape HTML special characters
        const escapedLine = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // Highlight the line that contains the error
        if (index === 0) {
            return `<strong>${escapedLine}</strong>`;
        } else {
            // Preserve spacing by replacing spaces with non-breaking spaces
            const preservedSpacingLine = escapedLine.replace(/ /g, '&nbsp;');
            return preservedSpacingLine;
        }
    });

    return formattedErrorLines.join('<br>');
}

