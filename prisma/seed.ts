import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const authors = await Promise.all([
        prisma.author.create({
            data: {
                name: 'Jane Smith',
                email: 'jane@example.com',
            },
        }),
        prisma.author.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
            },
        }),
        prisma.author.create({
            data: {
                name: 'Bob Johnson',
                email: 'bob@example.com',
            },
        }),
    ]);

    const articles = await Promise.all([
        prisma.article.create({
            data: {
                title: 'Article 1',
                authors: {
                    connect: [{ id: authors[0].id }, { id: authors[1].id }],
                },
                publicationYear: '2021',
                citedBy: 10,
            },
        }),
        prisma.article.create({
            data: {
                title: 'Article 2',
                authors: {
                    connect: [{ id: authors[1].id }, { id: authors[2].id }],
                },
                publicationYear: '2020',
                citedBy: 5,
            },
        }),
        prisma.article.create({
            data: {
                title: 'Article 3',
                authors: {
                    connect: [{ id: authors[0].id }, { id: authors[2].id }],
                },
                publicationYear: '2019',
                citedBy: 2,
            },
        }),
    ]);

    for (const author of authors) {
        const articlesByAuthor = await prisma.article.findMany({
            where: {
                authors: {
                    some: {
                        id: author.id,
                    },
                },
            },
        });

        const totalCitedBy = articlesByAuthor.reduce(
            (sum, article) => sum + (article.citedBy || 0),
            0
        );

        await prisma.author.update({
            where: { id: author.id },
            data: { citedBy: totalCitedBy },
        });
    }

    console.log('Seeded 3 authors and 3 articles');
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
