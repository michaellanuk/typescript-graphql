### GraphQL API with Node.js, TypeScript, and Prisma

Clone this repository:

```
git clone https://github.com/michaellanuk/typescript-graphql.git
```

Install npm dependencies:

```
cd typescript-graphql
npm install
```

### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates the `Article` and `Author` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.


### 3. Start the GraphQL server

Launch GraphQL server with command:

```
npm run dev
```

Navigate to [http://localhost:4000](http://localhost:4000) to explore the API in a [GraphQL Playground](https://github.com/prisma/graphql-playground).

