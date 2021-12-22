# 🎠 movieQL API Server Course

## Extending the schema

- `Query is Data`. That's like a `JSON data` so you need to send it to somewhere that is a _**`post`**_.
- This means that all the `queries`, `mutations` whatever it always will be sent as a _**`post`**_ because the _**server has to get**_.

<p align="center"><img src="https://user-images.githubusercontent.com/66893123/144374392-d5f7e678-1de9-417b-a395-80e415ca517d.png"  alt="graphql-query-post" width="545" height="187"></p>

&nbsp;

- There are 3 types that are already defined `queries`, `mutations`, `subscriptions`. Let's make more complex queries.
- I want to get only 1 person. I need to be able to get only `1 person` by `their ID`.

```javascript
// schema.graphql
type Query {
  person(id: Int!): Person
}
```

- `person(id: 1)` are going to return the person we found. I'm not putting **`!`** here because maybe we `won't find` that person.

&nbsp;

- you _**don't**_ need to have any kind of _**special DB back-end**_ as long as you `return` what you are `telling GraphQL` to return. so I'm gonna make a `new function getById`

```javascript
// graphql/db.js
export const getById = (id) => {
  const filteredPeople = people.filter((person) => person.id === String(id));
  return filteredPeople[0];
};
```

&nbsp;

## Creating Queries with Arguments

#### How do we get the _ID_ that the _user is giving us_?

- The _**GraphQL resolvers**_ are `called by GraphQL server`. Whenever the GraphQL server sees a `definition`, a `query` or a `mutation` or anything, he is going to look for a `resolver` and he's going to `execute that function`

```javascript
(_, args) => {
  console.log(args); // { id: 1 }
};
```

- and that function is going to give him `some arguments` here that we can go around with. The first one is about a current object, but it's not important so we are gonna write `_` in here.

&nbsp;

- GraphQL is calling your `resolver` with `the arguments` that you have here. As you can see, this approach is so much better than the REST or Express or Django approach

  - which is like you have to _**have URL**_ and the URL has to _**have parameters**_ or you have to _**send the form data**_ and then you have to _**parse the body**_ and _**a request object**_ and all that stuff

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

- You are defining `how your data looks like` in the _**operations**_ and you are `making functions` that will _**resolve this operation**_.

- It's all about `describing what is gonna happen`, and `make it happen` with your _**functions**_. the resolvers could be anything. It could be you go to _**different API**_ or you have the _**DB**_ or _**actual DB**_ whatever.

&nbsp;

## Defining Mutation

- Let's define a `Mutation`. A mutation is when the `DB changes of state`.

```javascript
// graphql/resolver.js
import { getMovies, getById, addMovie, deleteMovie } from "./db";

const resolvers = {
  .......
  Mutation: {
    addMovie: (_, { name, score }) => addMovie(name, score),
    deleteMovie: (_, { id }) => deleteMovie(id),
  },
};
```

&nbsp;

- The point is that if you want GraphQL to `call your mutations` or `your queries`, you have to put them inside of the `type query` and `type mutation`

```javascript
// graphql/schema.graphql
type Movie {
  id: Int!
  name: String!
  score: Int!
}

type Query {
  movies: [Movie]!
  movie(id: Int!): Movie
}

type Mutation {
  addMovie(name: String!, score: Int!): Movie!
  deleteMovie(id: Int!): Boolean!
}
```

&nbsp;

- I'm gonna make some functions, one is `deleteMovie by ID`. It's working with a different DB system. you can hook any DB you want.

```javascript
// graphql/db.js
export const deleteMovie = (id) => {
  const cleanedMovies = movies.filter((movie) => movie.id !== id);
  if (movies.length > cleanedMovies.length) {
    movies = cleanedMovies;
    return true;
  } else {
    return false;
  }
};

export const addMovie = (name, score) => {
  const newMovie = {
    id: movies.length + 1,
    name,
    score,
  };
  movies.push(newMovie);
  return newMovie;
};
```

&nbsp;

- and I'm gonna define a `Mutation`. one is gonna be called `addMovie`. we don't need the ID. It is going to be generated automatically by our DB. we need the name and the score, so the name is string and it's mandatory...

```javascript
// graphql/schema.graphql
.....
type Mutation {
  addMovie(name: String!, score: Int!): Movie!
  deleteMovie(id: Int!): Boolean!
}
```

&nbsp;

- Below one is awesome part about making APIs with _**GraphQL**_. It's just awesome to be able to see `what functions you have`, `what the requirements are` and `what you're gonna return`.

<p align="center"><img src="https://user-images.githubusercontent.com/66893123/144538250-4dd868f1-b752-4011-a749-a5a4dbe54d36.png"  alt="graphql-playground" width="523" height="489"></p>

&nbsp;

- you can `get the arguments`, GraphQL put you there for you. you don't have to `parse the body`, `get a request`, `get the parameters`, nothing
- we are doing `queries` when we `get movies` and we're doing `mutations` when we `change the state of DB`.

&nbsp;

## Wrapping a REST API with GraphQL

- you could `hook any back-end` to this _**GraphQL**_ and one of this backend that you can hook is another API, a _**REST API**_.

  - your `client` talks to you in `GraphQL language`, and then you take this `GraphQL server` and you talk to a `another API`. so we're going to try to talk to a _**REST API**_ via _**GraphQL server**_

&nbsp;

- I want the user to be able to `list movies` from this API. and I want to `filter the quantity` of the API. As you can see here, you can _**limit them**_ or you can _**sort_by title, year**_.... blah blah. Let's `limit by quality`. so this would be my URL.

```javascript
// graphql/db.js
import axios from "axios";
const BASE_URL = "https://yts.mx/api/v2/";
const LIST_MOVIES_URL = `${BASE_URL}list_movies.json`;

export const getMovies = async (limit, rating) => {
  const {
    data: {
      data: { movies },
    },
  } = await axios(LIST_MOVIES_URL, {
    params: {
      limit,
      minimum_rating: rating,
    },
  });
  return movies;
};
```

&nbsp;

- I want people to be able to _**get movies limit them**_ and also you know what I want them to be able to `minimum_rating`. This is if you want to, for example, `integrate your server` with a `different URL` whatever.

```javascript
// graphql/resolver.js
import { getMovie, getMovies, getSuggestions } from "./db";

const resolvers = {
  Query: {
    movie: (_, { id }) => getMovie(id),
    movies: (_, { rating, limit }) => getMovies(limit, rating),
    suggestions: (_, { id }) => getSuggestions(id),
  },
};
```

```javascript
// graphql/schema.graphql
type Movie {
  id: Int!
  title: String!
  rating: Float
  description_intro: String
  language: String
  medium_cover_image: String
  genres: [String]
}

type Query {
  movie(id: Int!): Movie
  movies(limit: Int, rating: Float): [Movie]!
  suggestions(id: Int!): [Movie]!
}
```

&nbsp;

- I'm wrapping an `REST API` into a `GraphQL API` and I can also `choose what do I want to see`. so in this way, you can just _**do the URLs**_ on your back-end.
- We're gonna `use GraphQL on the client` which is even more awesome.

&nbsp;

- I told you about `under-fetching`, `over-fetching`. Think of the screens to make, and I'm putting `2 queries`, movies and suggestions, `into 1`.
- If we use _**REST API**_, we need to have _**2 methods**_, _**getMovieID**_ and _**getSuggestions**_. but here on the `GraphQL`, I just can `put 2 of them` and I have all the data I need with `1 request` to paint my screen.
