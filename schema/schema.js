// 'use strict';
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} = graphql;

require('es6-promise').polyfill();
require('isomorphic-fetch');


const UserType = new GraphQLObjectType({
  name: 'User', //这个是object名
  fields:{
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt},
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:{
    user: {
      type: UserType,
      args: { id: {type: GraphQLString} },
      resolve: (parentValue, args) => {
        return fetch(`http://localhost:3000/users/${args.id}`)
            .then((response)=>{
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      },
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});