import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

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
  return <div>{file?.name}</div>;
}

export default Page;
