import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

function ChatInput({ isDisabled }: { isDisabled?: boolean }) {
  const { addMessage, handleChangeInput, isLoading, message } =
    useContext(ChatContext);

  const textareRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={textareRef}
                autoFocus
                rows={1}
                maxRows={4}
                value={message}
                onChange={handleChangeInput}
                placeholder="Enter your question..."
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareRef.current?.focus();
                  }
                }}
              />
              <Button
                aria-label="send message"
                className="absolute bottom-1.5 right-[8px]"
                disabled={isDisabled || isLoading}
                onClick={() => {
                  addMessage();
                  textareRef.current?.focus();
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
