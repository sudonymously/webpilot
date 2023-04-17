// src/components/ChatUI.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';
import { Message } from '@/types';
import Formatter from './formatter';

const RefreshIcon = ({ className = "w6 h6" }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
)

export const TypingIndicator: React.FC<{}> = () => {
    return (
        <div className="space-y-2 px-6 py-2">
            <div className="h-3 bg-zinc-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-3 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
        </div>
    );
};

const AssistantMessage: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="px-6 pb-4 text-[#BDC3D1] leading-relaxed font-mono">
            <div className="p-4 bg-[#1B1C20] border border-[#232838] rounded-lg flex">
                <div className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#AB6DEF" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#AB6DEF" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                </div>
                {children}
            </div>
        </div>

    )
}

const UserMessage: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="text-[#BDC3D1] px-6 pt-4">
            {children}
        </div>
    )
};

interface ChatProps {
    messages: Message[];
    onSubmit: (messages: Message[]) => void;
    isGenerating: boolean;
    height?: string;
    onReset?: () => void;
}


const Chat: React.FC<ChatProps> = ({ onSubmit, messages, height = "calc(50vh - 4rem - 1rem - 2px)", isGenerating, onReset }) => {
    const [input, setInput] = useState<string>('');
    const lastChatRef = useRef<HTMLDivElement>(null);
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            const updatedMessages: Message[] = [
                ...messages,
                { role: "user", content: input.trim() }
            ]
            onSubmit(updatedMessages);
            setInput('');
        }
    };

    const formatterComponents = useMemo(
        () => {
            if (messages.length === 0) return (
                <div className='flex justify-center items-center h-full text-[#707173] text-lg p-4 select-none'>
                    Generate something new or paste your React code into the editor to start.
                </div>
            );
            return (
                <>
                    {messages.map((message, index) => (
                        message.role === 'user' ? (
                            <div key={index}>
                                <UserMessage>
                                    <Formatter content={message.content} expandCode={true} />
                                </UserMessage>
                            </div>
                        ) : (
                            <div key={index} >
                                <AssistantMessage>
                                    <Formatter content={message.content} expandCode={messages.length - 1 === index ? true : false} />
                                </AssistantMessage>
                            </div>
                        )
                    ))}
                    <div ref={lastChatRef} className="h-1" />
                </>
            )
        },
        [messages, isGenerating]
    );

    return (
        <div className="bg-[#111215]  text-white flex flex-col" style={{ height: height }}>
            <div className="shadow-lg w-full flex-grow flex flex-col justify-between h-full">
                <div className="overflow-y-auto border-b border-zinc-900 flex-grow">
                    {formatterComponents}
                </div>
                <form onSubmit={handleSubmit} className="flex py-4 px-4 items-center">
                    <div onClick={onReset}>
                        <RefreshIcon className=" mr-4 w-6 h-6 cursor-pointer" />
                    </div>
                    <div className="relative flex-1 ">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className=" bg-[#1C1D21] p-4 text-sm placeholder-white placeholder-opacity-20 rounded-lg pr-10 w-full"
                            placeholder={messages.length ? 'Ask WebPilot to modify or create new components' : 'Generate multiple variations of editable todo list styled with tailwindcss'}
                            disabled={isGenerating}
                        />
                        <button
                            disabled={isGenerating}
                            type="submit"
                            className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill=""
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="transparent"
                                className="w-8 h-8 fill-[#AB6DEF] hover:fill-[#C18EF8]"
                            >
                                <circle cx="12" cy="12" r="9" stroke="transparent" />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    stroke="rgb(24, 24, 27)"
                                    d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
