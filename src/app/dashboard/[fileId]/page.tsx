import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import PdfRenderer from "@/components/pdfRenderer";
import ChatWrapper from "@/components/chat/ChatWrapper";
import { Provider } from "@/components/Provider";

type PageProps = {
  params: { fileId: string };
};

async function Page({ params }: PageProps) {
  const { fileId } = params;

  const session = await auth();
  if (!session?.user) redirect("/auth/login"); // needed?

  const file = await db.file.findFirst({
    where: { id: fileId, userId: session?.user?.id },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
          <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <Provider>
              <ChatWrapper fileId={file.id} />
            </Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
