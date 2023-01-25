import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { context } from './context';
import { schema } from './schema';

const yoga = createYoga({
    graphqlEndpoint: '/',
    context,
    schema,
});

const server = createServer(yoga);

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('🚀 Server ready at: http://localhost:4000');
});
