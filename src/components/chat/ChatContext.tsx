import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useState } from "react";
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

  const { mutate: sendMessage } = useMutation({
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
