interface OpenAIStreamProps {
    payload: any;
    openAIKey: string;
    onData: (content: string) => void;
    onDone: (cotent: string) => void;
    onFailed: (error: string) => void;
}

function parseResponse(response: string) {
    const newUpdates = response
        .replace("data: [DONE]", "")
        .trim()
        .split('data: ')
        .filter(Boolean)

    const newUpdatesParsed = newUpdates.map((update) => {
        const parsed = JSON.parse(update);
        return parsed.choices[0].delta?.content || '';
    });

    const newUpdatesJoined = newUpdatesParsed.join('')
    return newUpdatesJoined;
}

export default function OpenAIStream({
    payload,
    openAIKey,
    onData,
    onDone,
    onFailed
}: OpenAIStreamProps) {
    const url = 'https://api.openai.com/v1/chat/completions'
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${openAIKey}`);

    xhr.onprogress = function (event) {
        const response = parseResponse(xhr.responseText);
        onData(response)
    };

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = parseResponse(xhr.responseText);
                onDone(response)
            } else {
                console.error("Request failed with status " + xhr.status);
                onFailed("Request failed with status " + xhr.status)
            }
        }
    };

    const data = JSON.stringify(payload);

    xhr.send(data);
}