import { useEffect, useState } from "react";
import { transpileCode, formatBabelSyntaxError } from "@/utils/transpile";

interface SandboxProps {
    code: string;
    height: string;
}

function _hasNonReactImports(code: string) {
    const importRegex = /import\s+((?:.+\s+from\s+)?['"]([^'"]+)['"])/g;
    let match;
    let hasOtherImports = false;

    while ((match = importRegex.exec(code)) !== null) {
        if (match[2] !== 'react' && match[2] !== 'react-dom') {
            hasOtherImports = true;
            break;
        }
    }

    return hasOtherImports;
}

const Sandbox: React.FC<SandboxProps> = ({ code, height }) => {
    const [srcDoc, setSrcDoc] = useState("");
    const [transpileError, setTranspileError] = useState("");
    const [hasNonReactImports, setHasNonReactImports] = useState(false);


    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const transpileAndRender = async () => {
            setHasNonReactImports(_hasNonReactImports(code))
            try {
                setTranspileError("");
                let transpiledCode
                try {
                    transpiledCode = transpileCode(code)
                } catch (error) {
                    console.log(error)
                    setTranspileError(formatBabelSyntaxError(error as Error));
                }

                setSrcDoc(`
                    <div id="root" style="background-color: #FEFFFE;"></div>
                    <script>
                        window.onerror = function(message, source, lineno, colno, error) {
                        const errorContainer = document.createElement('div');
                        errorContainer.style.color = 'red';
                        errorContainer.innerHTML = '<strong>Error:</strong> ' + message;
                        document.body.appendChild(errorContainer);
                        console.error(message, source, lineno, colno, error);
                        return true; // This prevents the default error handling
                        };
                    </script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <script>${transpiledCode}</script>
                `);
            } catch (error) {
                console.log(error)
                console.error("Error transpiling and rendering React code:", error);
            }
        };

        transpileAndRender()

    }, [code]);

    return (
        <div style={{ height: `calc(${height} - ${hasNonReactImports ? '6rem' : '0px'} )` }}>
            {hasNonReactImports ? (
                <div className="w-full text-white bg-red-500 h-24 px-4 flex justify-center items-center">
                    <p className="font-bold">
                        Only imports from the core React library is supported in this sandbox. Other imports will result in errors even if the code is valid.
                    </p>
                </div>
            ) : null
            }
            {transpileError ? (
                <div className="text-red-500 p-4" dangerouslySetInnerHTML={{ __html: transpileError }} />
            ) : (
                <iframe
                    srcDoc={srcDoc}
                    title="output"
                    className="h-full w-full"
                />
            )}
        </div>
    )
}

export default Sandbox