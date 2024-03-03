import { getFileMessages } from "@/actions/files/getFileMessages";
import { INFINITE_QUERY_LIMIT } from "@/config/infiniteQueries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";

type MessageProps = {
  fileId: string;
  limit?: number;
  cursor?: string;
};

function Messages({ fileId }: MessageProps) {
  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: ["getMessages"],
    queryFn: () => getFileMessages({ fileId, limit: INFINITE_QUERY_LIMIT }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    keepPreviousData: true,
  });

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-4 w-4" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(true ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((msg, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1)
            return (
              <Message
                // @ts-ignore
                message={msg}
                key={msg?.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          else
            return (
              <Message
                // @ts-ignore
                message={msg}
                key={msg?.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default Messages;
