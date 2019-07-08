const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const app = require('express')();

app.use('/graphql', expressGraphQL({
    schema,
    graphiql : true,
}));

app.listen(4000, () => {
    console.log('Listening');
});

// test