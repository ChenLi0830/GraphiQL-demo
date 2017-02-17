// 'use strict';
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

require('es6-promise').polyfill();
require('isomorphic-fetch');

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        return fetch(`http://localhost:3000/companies/${parentValue.id}/users`)
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User', //这个是object名
  fields: () => ({
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt},
    company: {
      type: CompanyType,
      resolve(parentValue, args){
        // console.log("parentValue.companyId", parentValue.companyId);
        return fetch(`http://localhost:3000/companies/${parentValue.companyId}`)
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      },
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve: (parentValue, args) => {
        return fetch(`http://localhost:3000/users/${args.id}`)
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      },
    },
    company: {
      type: CompanyType,
      args: {id: {type: GraphQLString}},
      resolve: (parentValue, args) => {
        return fetch(`http://localhost:3000/companies/${args.id}`)
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      },
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        companyId: {type: GraphQLString}
      },
      resolve(parentValue, {firstName, age, companyId}){
        return fetch(`http://localhost:3000/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName,
            age,
            companyId
          })
        })
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});