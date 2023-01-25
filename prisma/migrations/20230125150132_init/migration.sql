-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "publicationYear" TEXT NOT NULL,
    "citedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "citedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToAuthor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToAuthor_AB_unique" ON "_ArticleToAuthor"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToAuthor_B_index" ON "_ArticleToAuthor"("B");

-- AddForeignKey
ALTER TABLE "_ArticleToAuthor" ADD CONSTRAINT "_ArticleToAuthor_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToAuthor" ADD CONSTRAINT "_ArticleToAuthor_B_fkey" FOREIGN KEY ("B") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
