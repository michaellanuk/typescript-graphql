import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { context } from './context';

const yoga = createYoga({
    graphqlEndpoint: '/',
    context,
});

const server = createServer(yoga);

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('🚀 Server ready at: http://localhost:4000');
});
