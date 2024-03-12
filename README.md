# PDFChat - Chat with your Documents in seconds.

![PDFChat Main App](./public/pdf-chat-main-interface.png)

This is a repository for PDFChat application built With Nextjs, Tailwind, Shandcn-UI, OpenAI API.

Features:

- 🌐 Next.js 14 framework
- 💅 TailwindCSS & ShadcnUI styling
- 🔐 Clerk authentication & user management
- 💾 Prisma ORM and PostgreSQL
- ⬆️ PDF File upload using UploadThing
- ⛓️ Langchain Framework
- 🗃️ Pinecone API vector database
- 💬 Chat functionality
- 🧠 OpenAI embeddings model and API

### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/aditya-2010/pdf-chat.git
```

### Install packages

```shell
npm install
```

### Setup .env file

```js
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
PINECONE_API_KEY=
OPENAI_API_KEY=
```

### Start the app

```shell
npm run dev
```
