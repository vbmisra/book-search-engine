const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        password: String!
        numberBooks: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Query {
        user: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        newUser(username: String!, email: String!, password: String!): Auth
        updateBook(bookData: BookInput): User
        deleteBook(bookId: ID!): User
    }
`

module.exports = typeDefs