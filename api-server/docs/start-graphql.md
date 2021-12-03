# 🌌 movieQL API Server Course

## Problems solved by GraphQL

- GraphQL makes _**back-end development super easy**_. Let's talk about 2 problems the GraphQL solves.
- 1 thing is called `over-fetching` and 1 thing is called `under-fetching`.

&nbsp;

### Over-Fetching

- This means you `get more information` from the server than `the information you asked for`.

- You want to display a _**list of all the user names**_ on your website. You may use `/users/ GET`. but that user things is not gonna give you only the user name, is gonna give you _**the user name**_, _**the last name**_, _**the profile img**_ ... `all that stuff` of all that users.

- That's not efficient. This makes the connection of your customer get all this information that you're not gonna use.

&nbsp;

### Under-Fetching

- It is when you have to `make another requests` to `accomplish 1 thing`. for exmaple, Let's say the App starts, and you want to _**get the feed**_ of the instagram page, you also want to _**get the notifications**_, and you also want to _**get the user profile**_

```javascript
/feed/
/notifications/
/user/1/
```

- This is `3 requests` data going and coming `3 times` to initiallize your application. This means that on **REST**, you need to call many sources sometimes to _**complete 1 thing**_. and this is something that GraphQL also fixes for you.

&nbsp;

## GraphQL solves the problems

- You can actually `describe all the information` that you want on `1 query`. There is `no URL system`. There's just only `1 endpoint`.

```javascript
/graphql
```

&nbsp;

- I can just `create 1 query`, that ask something to the DB. I can just _**create 1 query**_ and just describe with `a GraphQL language`. I can `describe what information do I want`. This is something called a `query`, and you will _**send**_ this to your _**graphql back-end**_.

```javascript
query {
  feed {
	comments
	likeNumber
  }
  notifications {
	isRead
  }
  user {
	username
	profilePic
  }
}
```

&nbsp;

- These will give you `an object` with the answer like that. They will be `JS object`. That is GraphQL language and This is JS.

```javascript
{
  feed: [{
	   comments: 1,
	   likeNumber: 20
	}],
  notifications: [{
	   isRead: true,
	},
   {
	   isRead: false,
	}],
  user: {
	username: "nico",
	profile: "https://~~"
  }
}
```

- Above one is what you will `send to GraphQL` and Below one is what `GraphQL will give you`, a `JS object` with exactly what you asked for.

&nbsp;

## Creating a GraphQL Server with GraphQL Yoga

- [GraphQL yoga](https://github.com/dotansimha/graphql-yoga) is something like cra, basically. That helps you start your GraphQL project as fast as you can. `Fully-featured GraphQL Server` with focus on `easy setup`, This is what we are going to learn it how to use.

- First of all, I will install everything below. @babel/node basically lets you write very nice like import {} kinda thing in nodejs.

```bash
npm i -D graphql-yoga nodemon @babel/cli @babel/core @babel/node @babel/preset-env
```

&nbsp;

- I need to create a server. I want to show you exactly what I'm gonna follow which is this quick start.

```javascript
import { GraphQLServer } from "graphql-yoga";
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
```

&nbsp;

- I'm going to configure .babelrc. here, we can put all the configuration for babel.

```javascript
{
  "presets": ["@babel/preset-env"]
}
```

&nbsp;

- start a GraphQL server is the easiest thing. In GraphQLServer we need to give it `some configuration`. server.start() and we're gonna make a call back and say console.log

```javascript
import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolver";

const server = new GraphQLServer({
  typeDefs: "graphql/schema.graphql",
  resolvers,
});
server.start(() => console.log("Server is running on localhost:4000"));
```

&nbsp;

## Creating Query(s) and Resolvers

- I want you to think of `schema` as a `description of the data` that you're gonna `get` and the data that you're gonna `send`. This is only for GraphQL to understand, this is not for programming / nodejs.

- I can create a `new type`. I call this type Person and Person has these things. This is 1 advantage of `describing your API data`. I have a description of _**what my data looks like**_.

```javascript
// schema.graphql file
type Person {
  id: Int!
  name: String!
  age: Int!
  gender: String!
}

type Query {
  people: [Person]!
  person(id: Int!): Person
}
```

- GraphQL has `these types` defined on the _**specification**_ and on the _**server**_. so as you can see GraphQL is a very safe environment in the sense of typing.

&nbsp;

- start defining what the user is gonna do. _**`Query`**_ is only when you _**`get data`**_ and _**`Mutation`**_ is when you _**`mutate data`**_, which is when you make an operation that `changes the data` on _**your server**_, on _**your DB**_, on the memory. Anywhere that would be a mutation

- My query will be _**people**_, and I'm gonna give him as an answer _**a Person array**_, and the answer is _**required**_, that is a `Query`. When somebody sends a query with the key _**people**_, I'm gonna send him _**a Person array**_. This is a `description of the response`

```javascript
// scheman.graphql file
type Query {
  people: [Person]!
  person(id: Int!): Person
}
```

&nbsp;

- what we did was we are `describing` only _**what happens**_ when somebody `sends the query` and `we give` him an object, but now actually our _**nodejs has to do something**_. We need to actually `program the functionality` of this people `query`.

&nbsp;

- `Resolver` is something that `resolves a Query`. Query is like a question to your DB, so we need to resolve it in some kind of way.
- I'm going to write `a resolver` for `a query` and now the _**name of the query**_ that I want to _**resolve**_ is _**people**_. when somebody sends me the _**people query**_ I want to `answer with a function`.

```javascript
import { people, getById } from "./db";

const resolvers = {
  Query: {
    people: () => people,
    person: (_, { id }) => getById(id),
  },
};

export default resolvers;
```

&nbsp;

- so I `describe the query` and then I actually `program the resolver`. So as you can see in GraphQL, we _**don't**_ have view _**URLs**_ and stuff like that, we just have a `query` and a `resolver`. That'll be it and you can program the resolver however you like

- It will go to the DB, It will go to a different DB, or memory, or go and connect to another API. That is your code

  - localhost:4000 this will give me a GraphQL playground. this is something that comes with in graphql yoga
