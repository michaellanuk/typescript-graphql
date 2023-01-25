import { createSchema } from 'graphql-yoga'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'

export const typeDefs = `
  type Mutation {
    createArticle(title: String!, publicationYear: String!, authorIds: [Int]!): Article
    cite(id: Int!): Article
  }

  type Article {
    id: Int!
    title: String!
    authors: [Author!]!
    publicationYear: String!
    citedBy: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    authors: [Author!]!
    articleById(id: Int): Article
    articles: [Article!]!
  }

  type Author {
    id: Int!
    name: String!
    email: String
    articles: [Article!]!
    citedBy: Int
  }

  scalar DateTime
`

export const resolvers = {
    Query: {
        authors: (_parent, _args, context: Context) => {
            return context.prisma.author.findMany();
        },
        articleById: (_parent, args: { id: number }, context: Context) => {
            return context.prisma.article.findUnique({
                where: { id: args.id || undefined },
            });
        },
        articles: (_parent, args, context: Context) => {
            return context.prisma.article.findMany();
        },
    },
    Mutation: {
        createArticle: (_parent, args, context) => {
            const { title, publicationYear, authorIds, citedBy = 0 } = args;
            return context.prisma.article.create({
                data: {
                    title,
                    publicationYear,
                    citedBy,
                    authors: { connect: authorIds.map((id) => ({ id })) },
                },
            });
        },

        cite: async (_parent, args: { id: number }, context: Context) => {
            const updatedArticle = await context.prisma.article.update({
                where: { id: args.id || undefined },
                data: {
                    citedBy: {
                        increment: 1,
                    },
                },
            });

            const authors = await context.prisma.article
                .findUnique({
                    where: { id: args.id || undefined },
                })
                .authors() || [];

            // update the citedBy field for each author
            await Promise.all(
                authors.map((author) =>
                    context.prisma.author.update({
                        where: { id: author.id },
                        data: {
                            citedBy: {
                                increment: 1,
                            },
                        },
                    })
                )
            );

            return updatedArticle;
        },

    },
    DateTime: DateTimeResolver,
    Article: {
        authors: (parent, _args, context: Context) => {
            return context.prisma.article
                .findUnique({
                    where: { id: parent?.id },
                })
                .authors();
        },
    },
    Author: {
        articles: (parent, _args, context: Context) => {
            return context.prisma.author
                .findUnique({
                    where: { id: parent?.id },
                })
                .articles();
        },
    },
};

export const schema = createSchema({
    typeDefs,
    resolvers,
});
