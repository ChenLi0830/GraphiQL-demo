// 'use strict';
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} = graphql;

const _ = require('lodash');

const users = [
  {id: "123", firstName: "Brian", age:"36"},
  {id: "121", firstName: "Rachel", age:"26"}
];

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
        return _.find(users, {id: args.id});
      },
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});