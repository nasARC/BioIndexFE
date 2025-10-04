import { useCallback, useEffect, useMemo, useState } from "react";
import { type RequestResponsePair } from "../lib/types";
import MessageCard from "./messagecard";

interface MessageCardPairProps {
  pair: RequestResponsePair,
  options: MessageCardOptions,
  onRemove: () => void,
}

interface MessageCardOptions {
  avatarUrl?: string | null,
}

export default function MessageCardPair(props: MessageCardPairProps) {
  const { request, response, setResponse, timestamp } = props.pair;
  const requestText = useMemo(() => request, [request]);
  const [responseText, setResponseText] = useState("");

  const readStream = useCallback(async (stream: ReadableStream, callback: (v: string) => void, onDone: (v: string) => void) => {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");

    let res = "";
    while (true) {
      const { done, value } = await reader.read();
      res += decoder.decode(value, { stream: true });
      if (done) {
        onDone(res);
        return;
      }
      callback(res);
    }
  }, []);
 
  useEffect(() => {
    if (typeof response !== typeof "") {
      //@ts-expect-error we already check the type above
      readStream(response, setResponseText, setResponse);
    } else {
      //@ts-expect-error we already check the type above
      setResponseText(response);
    }
  }, [response, readStream, setResponse]);

  return (
    <>
      <MessageCard type="request" content={requestText} sender={"You"} timestamp={timestamp} imageSrc={"/user.png"} onRemove={props.onRemove} />
      <MessageCard type="response" content={responseText} sender="BioIndex Assitant" timestamp={timestamp} imageSrc={"/logotrans.png"} onRemove={props.onRemove} />
    </>
  )
}
