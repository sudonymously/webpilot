import ReactMarkdown from 'react-markdown'
import React from 'react';
import Editor from './editor';
import { useCode } from '@/hooks/useCode';
import { calcCodeContainerHeight } from '@/utils';

interface AccordingProps {
    content: string | JSX.Element;
    actionButton: JSX.Element;
    isExpanded: boolean;
}

function Accordion({ content, actionButton, isExpanded }: AccordingProps) {
    const [_isExpanded, setIsExpanded] = React.useState(isExpanded);

    const toggleAccordion = () => {
        setIsExpanded(!_isExpanded);
    };

    return (
        <div className="py-2">
            <div className="bg-[#111215] rounded-md border border-[#232838]">
                <div
                    className="p-2 px-4 flex justify-between items-center cursor-pointer select-none"
                    onClick={toggleAccordion}
                >
                    <span className="text-sm">Code</span>
                    <div className="w-full flex justify-end items-center mr-4">
                        {actionButton}
                    </div>

                    {_isExpanded ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    )}
                </div>
                {_isExpanded && (
                    <div className=" p-4 border-t border-zinc-700 overflow-x-auto">{content}</div>
                )}
            </div>
        </div>
    );
}

interface FormatterProps {
    content: string;
    expandCode: boolean;
}

export default function Formatter({ content, expandCode = false }: FormatterProps) {
    const { setCode } = useCode()
    return (
        <div className="h-full w-full formatter">
            <ReactMarkdown
                children={content} // eslint-disable-line react/no-children-prop
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        // we skip rendering the code block because
                        return !inline && match ? (
                            <Accordion
                                isExpanded={expandCode}
                                content={
                                    <Editor
                                        code={String(children).trim()}
                                        readonly={true}
                                        height={`${calcCodeContainerHeight(String(children).trim())}px`}
                                        showGutter={false}
                                    />
                                }
                                actionButton={<button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCode(String(children) + "\n")
                                    }}
                                    className="text-sm border border-zinc-700 px-2 py-1 rounded">
                                    Load in Editor
                                </button>
                                } />
                        ) : (
                            <code className={`${className} text-xs bg-zinc-900`} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
            />
        </div>
    )
}