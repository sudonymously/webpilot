import Modal from "./modal";

interface TipsProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

const Tips = ({ show, setShow }: TipsProps) => {
    return (
        <Modal
            showModal={show}
            onClose={() => setShow(false)}
        >
            <div>
                <h2 className="text-lg mb-4 font-semibold mt-4 text-white">Tips & Limitations of Beta</h2>
                <p className="text-base text-zinc-300">
                    👋 Welcome to our new AI-powered code generator! Say goodbye to cookie-cutter React components and heavy dependencies from external libraries.
                    Our tool creates fully customized components so you can ship your projects faster. Try it out and let us know what you think!
                </p>
                <div>
                    <div className="text-base text-zinc-300 flex flex-col space-y-4 mt-4">
                        <div className="">
                            <span className="font-bold">Tips:</span>
                            <ul className="list-disc list-inside text-zinc-300">
                                <li>Generate React components by describing it or pasting your own code</li>
                                <li>Edit code in the editor and preview updates live</li>
                                <li>Code in the editor is used as context for further modifications</li>
                                <li>Detailed descriptions yield better results</li>
                                <li>Use feedback button to request features or report bugs</li>
                                <li>If external libraries are generated, ask WebPilot to remove them</li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-bold">Limitations:</span>
                            <ul className="list-disc list-inside text-zinc-300">
                                <li>WebPilot generates single React components, not full sites</li>
                                <li>Supports only React and Tailwindcss (more libraries coming soon)</li>
                                <li>Preview does not render Typescript (coming soon)</li>
                                <li>WebPilot may be slow at times (speed improvements coming soon)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

    )

}

export default Tips