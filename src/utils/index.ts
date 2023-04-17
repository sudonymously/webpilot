export function extractCodeBlocks(text: string) {
    const codeBlocks = [];
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;

    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
        const language = match[1] || null;
        const code = match[2].trim();

        codeBlocks.push({ language, code });
    }

    return codeBlocks;
}

// calculate height by lines of code
export function calcCodeContainerHeight(code: string) {
    const lines = code.split(/\r\n|\r|\n/).length;
    return (lines * 17) + 20;
}
