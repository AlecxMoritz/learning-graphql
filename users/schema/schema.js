const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;
const axios = require('axios');

const CompanyType = new GraphQLObjectType({
    name : 'Company',
    fields : {
        id : { type : GraphQLString },
        name : { type : GraphQLString },
        description : { type : GraphQLString }
    }
});
// * You can think of resolve as how different nodes 'get' to each other


const UserType = new GraphQLObjectType({
    name : 'User',
    fields : {
        // when the incoming data and the type have the same name
        // GraphQL can map it automatically
        id : { type : GraphQLString },
        firstName : { type : GraphQLString },
        age : { type : GraphQLInt },
        // when they are different, we have to give it a resolve function
        // to help GraphQL figure out how to get that data
        company : { 
            type : CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(res => res.data)
            }
        }
    }
});



const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        user : {
            type : UserType,
            args : { id : { type : GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${ args.id }`)
                    .then(resp => resp.data);
            }
        },

        company : {
            type : CompanyType,
            args : { id : { type : GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query : RootQuery
})