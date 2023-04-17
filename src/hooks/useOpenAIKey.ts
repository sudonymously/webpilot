import { useEffect, useState } from "react";

export default function useOpenAIKey() {
    const [openAIKey, setOpenAIKey] = useState<string>("");

    useEffect(() => {
        const key = localStorage.getItem("openAIKey");
        if (key) {
            setOpenAIKey(key);
        }
    }, [])

    useEffect(() => {
        // set key to local storage
        localStorage.setItem("openAIKey", openAIKey);
    }, [openAIKey])

    return {
        openAIKey,
        setOpenAIKey
    }
}