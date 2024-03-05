import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";

type SreamResponse = {
  message: string;
  addMessage: () => void;
  handleChangeInput: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

type ProviderProps = {
  fileId: string;
  children: ReactNode;
};

export const ChatContext = createContext<SreamResponse>({
  message: "",
  addMessage: () => {},
  handleChangeInput: () => {},
  isLoading: false,
});

export const ChatContextProvider = ({ fileId, children }: ProviderProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const backupMessage = useRef("");

  const queryClient = useQueryClient();

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["get-file-messages"],
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ fileId, message }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      // step 1
      await queryClient.cancelQueries(["getMessages"]);

      const previousMessages = queryClient.getQueryData(["getMessages"]);

      queryClient.setQueryData(["getMessages"], (old: any) => {
        if (!old)
          return {
            pages: [],
            pageParams: [],
          };

        let newPages = [...old.pages];

        let latestPage = newPages[0]!;

        latestPage.messages = [
          {
            createdAt: new Date().toISOString(),
            id: crypto.randomUUID(),
            text: message,
            isUserMessage: true,
          },
          ...latestPage.messages,
        ];

        newPages[0] = latestPage;

        return { ...old, pages: newPages };
      });

      setIsLoading(true);

      return {
        previousMessages: [],
        // previousMessages?.pages.flatMap((page: any) => page.messgaes) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast.toast({
          title: "Something went wrong!",
          description: "Please reload and page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accResponse += chunkValue;
      }

      queryClient.setQueryData(["getMessages"], (old: any) => {
        if (!old)
          return {
            pages: [],
            pageParams: [],
          };

        let isAiResponseGenerated = old.pages.some((page: any) =>
          page.messages.some((message: any) => message.id === "ai-response")
        );

        let updatedPages = old.pages.map((page: any) => {
          if (page === old.pages[0]) {
            let updatedMessages;

            if (!isAiResponseGenerated) {
              updatedMessages = [
                {
                  createdAt: new Date().toISOString(),
                  id: "ai-response",
                  text: accResponse,
                  isUserMessage: false,
                },
                ...page.messages,
              ];
            } else {
              updatedMessages = page.messages.map((message: any) => {
                if (message.id === "ai-response") {
                  return {
                    ...message,
                    text: accResponse,
                  };
                }
                return message;
              });
            }
            return {
              ...page,
              messages: updatedMessages,
            };
          }

          return page;
        });
        return { ...old, pages: updatedPages };
      });
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      queryClient.setQueryData(["getMessages"], {
        fileId,
        messages: context?.previousMessages ?? [],
      });
    },
    onSettled: async () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["getMessages"] });
    },
  });

  const addMessage = () => sendMessage({ message });

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <ChatContext.Provider
      value={{ message, addMessage, handleChangeInput, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
