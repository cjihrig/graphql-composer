'use strict'

const schema = `
  input AuthorInput {
    firstName: String!
    lastName: String!
  }

  type AuthorTodo {
    task: String
  }

  type AuthorName {
    firstName: String
    lastName: String
  }

  type Author {
    id: ID
    name: AuthorName
    todos(id: ID!): [AuthorTodo]
  }

  type BlogPostPublishEvent {
    authorId: ID!
  }

  type Query {
    get(id: ID!): Author
    list: [Author]
  }

  type Mutation {
    createAuthor(author: AuthorInput!): Author!
    publishBlogPost(authorId: ID!): Boolean!
  }

  type Subscription {
    postPublished: BlogPostPublishEvent
  }
`

let authors
let todos

function reset () {
  authors = {
    1: {
      id: 1,
      name: {
        firstName: 'Peter',
        lastName: 'Pluck'
      }
    }
  }

  todos = {
    1: {
      id: 1,
      authorId: 1,
      task: 'Write another book'
    },
    2: {
      id: 2,
      authorId: 1,
      task: 'Get really creative'
    }
  }
}

reset()

const resolvers = {
  Query: {
    async get (_, { id }) {
      return authors[id]
    },
    async list () {
      return Object.values(authors)
    }
  },
  Mutation: {
    async createAuthor (_, { author: authorInput }) {
      const id = Object.keys(authors).length + 1
      const author = {
        id,
        name: { ...authorInput }
      }

      authors[id] = author
      return author
    },

    async publishBlogPost (_, { authorId }, context) {
      context.app.graphql.pubsub.publish({
        topic: 'PUBLISH_BLOG_POST',
        payload: {
          postPublished: {
            authorId
          }
        }
      })

      return true
    }
  },
  Subscription: {
    postPublished: {
      subscribe: (root, args, ctx) => {
        return ctx.pubsub.subscribe('PUBLISH_BLOG_POST')
      }
    }
  },
  Author: {
    async todos (_, { id }) {
      return Object.values(todos).filter((t) => {
        return String(t.id) === id
      })
    }
  }
}

module.exports = { schema, reset, resolvers }
