const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if (context.user) {
                const userInfo = await User.findOne({ _id: context.user._id }).select('-__v -password')

                return userInfo
            }

            throw new AuthenticationError('User is not logged in')
        }
    },

    Mutation: {
        newUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)

            return { token, user }
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            if (user) {
                const correctPassword = await User.isCorrectPassword(password)

                if (correctPassword) {
                    const token = signToken(user)

                    return { token, user }
                }
            }

            throw new AuthenticationError('Login credentials are not correct')
        },
        updateBook: async (parent, { bookData }, context ) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                )

                return user
            }

            throw new AuthenticationError('Please log in before saving a book!')
        },
        deleteBook: async (parent, { bookId }, context ) => {
            if (context.user) {
                const user = await User. findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )

                return user
            }

            throw new AuthenticationError('Please log in before removing a book')
        }
    }
}

module.exports = resolvers
