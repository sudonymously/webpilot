import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Sandbox from '@/components/sandbox'
import Chat from '@/components/chat'
import { useCode } from '@/hooks/useCode'
import { useEffect, useState, useRef } from 'react'
import { Message } from '@/types'
import Editor from '@/components/editor'
import { extractCodeBlocks } from '@/utils'
import useResizablePanels from '@/hooks/useResizablePanels'
import ResizeHandler from '@/components/resize-handler'
import Tips from '@/components/tips'
import Dropdown from '@/components/dropdown'
import Link from 'next/link'
import useOpenAIKey from '@/hooks/useOpenAIKey'
import { buildPrompts } from '@/prompts'
import OpenAIStream from '@/utils/openai-stream'

const inter = Inter({ subsets: ['latin'] })

const initialCode = `
//Edit code here and see the changes in the preview
function Welcome() {
  return (
    <div className="h-screen w-screen flex bg-gray-50 items-center justify-center">
      <div className="max-w-xl w-full p-8 border-2 border-gray-200 rounded-xl shadow-lg">
        <div className="text-gray-900 my-12">
          <h1 className="text-5xl font-bold text-center m-2">WebPilot</h1>
          <p className="text-lg m-2">
            Like CodePen + ChatGPT for Generating React Components
          </p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Welcome />, document.getElementById("root"));

`

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [showLimits, setShowLimits] = useState<boolean>(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [model, setModel] = useState<string>("gpt-3.5-turbo")
  const { code, setCode, setEditCode, isEdited, setIsEdited } = useCode()
  const { openAIKey, setOpenAIKey } = useOpenAIKey()
  const { editorHeight, chatHeight, leftPanelWidth, rightPanelWidth, handleHorizontalResize, handleVerticalResize } = useResizablePanels("45vh", "50vw");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCode(initialCode)
  }, [setCode])

  const onSubmit = async (updatedMessages: Message[]) => {
    if (openAIKey === "") {
      setIsDropdownOpen(true)
      return
    }
    setMessages(updatedMessages)
    setIsGenerating(true)

    const prompts = buildPrompts(updatedMessages, isEdited ? code : null)
    const payload = {
      model: model,
      messages: prompts,
      temperature: 0.7,
      stream: true
    };

    const onReceiveData = (content: string) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage.role !== "assistant") {
          prev = [...prev, { role: "assistant", content: content }]
        } else {
          prev[prev.length - 1].content = content
        }
        return [...prev]
      })
    }

    const onDone = (content: string) => {
      setIsEdited(false)
      setIsGenerating(false)
      const codeBlocks = extractCodeBlocks(content)
      if (codeBlocks.length > 0) {
        const firstCodeBlock = codeBlocks[0]
        setCode(firstCodeBlock.code + "\n\n") // add two new lines to the end of the code for better readability 
      }
    }

    OpenAIStream({
      payload,
      openAIKey,
      onData: onReceiveData,
      onDone,
      onFailed: (err) => console.error(err)
    })
  }

  // create a debounced function that takes in another function taht will be executed after 1 second of inactivity
  // the function use use a timerRef to keep track of the previous timeout
  const debounce = (fn: (code: string) => void, timer = 1000) => {
    return (code: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        fn(code)
      }, timer);
    }
  }

  const handleOnCodeEdit = (code: string) => debounce(setEditCode)(code)
  const clearChatContext = () => {
    setMessages([])
    setCode("")
    setIsEdited(false)
    setIsGenerating(false)
  }

  return (
    <>
      <Head>
        <title>CodePen + ChatGPT for generating React Components</title>
        <meta name="description" content="Generate Front-end code seamlessly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <Tips show={showLimits} setShow={setShowLimits} />
        <header className="flex h-16 items-center border-b border-[#232838] py-2 px-6 bg-[#111215]">
          <span className="text-xl text-white font-black w-full flex">
            <Image src="./logo.svg" alt="logo" width={140} height={140} />
          </span>
          <button onClick={() => setShowLimits(true)} className="flex items-center space-x-2 rounded-md border border-zinc-800 shadow-sm px-4 py-2 mx-2 bg-zinc-900 text-sm font-medium text-zinc-300 hover:text-zinc-200 hover:border-zinc-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span>Tips</span>
          </button>
          <Dropdown
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            title={
              <div className="flex justify-center items-center space-x-2 w-96 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
                <span>Set OpenAI Key</span>
              </div>
            }>
            <div className="flex flex-col space-y-2 mx-2">
              <p>OpenAI API Key is required to use this app. You can get one from the <Link className="text-blue-500" href="https://platform.openai.com/account/api-keys" target="_blank" rel="noreferrer">Open AI Platform</Link>.</p>
              <p>Keys are stored locally via Browsers local storage & API calls are made directly to OpenAI.</p>
              <input
                className="bg-zinc-800 p-2 py-3 text-sm placeholder-white placeholder-opacity-20 rounded-lg pr-10 w-full"
                type="text"
                autoComplete="false"
                placeholder='OpenAI API Key'
                value={openAIKey ?? ''}
                onChange={(e) => setOpenAIKey(e.target.value)}
              />
              <button onClick={() => setOpenAIKey('')} className="bg-zinc-800 rounded py-1">Clear</button>
            </div>
          </Dropdown>
          <div>
            <select
              id="selector"
              name="selector"
              className="flex items-center space-x-2 rounded-md border border-zinc-800 shadow-sm px-4 py-2 mx-2 bg-zinc-900 text-sm font-medium text-zinc-300 hover:text-zinc-200 hover:border-zinc-200"
              onChange={(e) => setModel(e.target.value)}
              value={model}
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              <option value="gpt-4">gpt-4</option>
            </select>
          </div>
          <Link className="mx-2" href="https://github.com/sudonymously/webpilot" target="_blank" rel="noreferrer">
            <Image src="./github-mark-white.svg" alt="logo" width={40} height={40} />
          </Link>
        </header>
        <div className="flex">
          <div className="" style={{ height: "calc(100vh - 4rem)", width: leftPanelWidth }}>
            <Editor code={code} onChange={handleOnCodeEdit} height={editorHeight} />
            <ResizeHandler onDrag={handleHorizontalResize} />
            <Chat height={chatHeight} messages={messages} onSubmit={onSubmit} isGenerating={isGenerating} onReset={clearChatContext} />
          </div>
          <ResizeHandler onDrag={handleVerticalResize} type="vertical" />
          <div className="" style={{ height: "calc(100vh - 4rem)", width: rightPanelWidth }}>
            <Sandbox code={code} height={"calc(100vh - 4rem)"} />
          </div>
        </div>
      </main>
    </>
  )
}
