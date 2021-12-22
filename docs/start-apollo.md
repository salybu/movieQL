# 🎄 movieQL Apollo Client Course

## GraphQL APIs

- What we're going to build is basically a `React Client` for the `GraphQL API`. We're going to build a _**React application**_ that is going to consume that _**GraphQL API**_. The way that you call the API is completely different between _**REST API**_ and _**GraphQL**_.

- `GraphQL APIs` are not like _**REST APIs**_ where you _**go to a URL**_ and you _**get some JSON**_. on `GraphQL`, you have to `send a query` or you have to `send a mutation`. so It requires a different approach to what you are used to.

&nbsp;

- In `GraphQL API`, you need to `write queries` like movies... so this requires a different set of tools to be able to request data.

  - You can do it manually, and what that means is that you need to basically `send this query` in a `POST request` with `fetch` / `axios` whatever you want.

- If you press a button in GraphQL playground, and you can show in Network Tab in development Tools, this is a `fetch`. What I'm sending basically is a `POST request`, with a something called _**operationName**_, _**variables**_, and _**query**_ .... and you can see what you get

<p align="center"><img src="https://user-images.githubusercontent.com/66893123/144777751-10caf74c-dccb-4cad-bdfb-843b0dbe5627.png"  alt="post payload" width="769" height="151"></p>
&nbsp;

## Apollo Client

- `Apollo` is the best way (not the only way) to consume `GraphQL APIs`.

```bash
npm install @apollo/client graphql
```

&nbsp;

- The amazing `Apollo` helps you, so you don't have to do that by yourself. First thing we need to do is to `create a Client`. Client looks like this, and it's very easy to create.

```javascript
// apollo.js
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({});
```

&nbsp;

- This client needs 1 thing only, a `URI` which is your `API` basically. Because you don't want to be pulling the `same URL` everywhere, on `GraphQL` we don't have URLs like _**/list**_, _**/movies**_... so we don't need to `paste the same URL` over and over again.

```javascript
// apollo.js
const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});

export default client;
```

&nbsp;

- We need to `wrap our React application` on that `Client`. in index.js, I'm gonna write `Apollo provider` and I'm gonna **wrap my application** around it. What `ApolloProvider` needs a `client`, so Let's give it a client

```javascript
// index.js
import { ApolloProvider } from "@apollo/client";
import client from "./apollo";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

&nbsp;

## GET MOVIES Query

#### First, we need to write a Query.

- At the top of my Homepage, I just want the ID of the movies and the poster. First we need to `write this Query` here on our JS, and our JS doesn't understand GraphQL. So we need to `import { gql, useQuery }`.

```javascript
// routes/Home.js
import { gql, useQuery } from "@apollo/client";

const GET_MOVIES = gql`
  {
    movies {
      id
      medium_cover_image
    }
  }
`;
```

- What we're gonna do is `write a query` and the query is gonna be `outside of the component`. ` write gql ``  ` and I'm basically gonna `paste my query`

&nbsp;

#### How do we use a Query?

- Thanks to the `@apollo/client`, we get something really cool called `useQuery` and it `requires a query`. That's how easy it is with the hooks

```javascript
// routes/Home.js
.....
const Home = () => {
  const { loading, error, data } = useQuery(GET_MOVIES);
  if (loading) {
    return "loading... ";
  }
  if (data && data.movies) {
    return data.movies.map((movie) => <h1>{movie.id}</h1>);
  }
};

export default Home;
```

- also we get `error` out of `useQuery`. and my movies are here, and we didn't do `any fetching`, `any post`, we just get them here.

- `Apollo` `GraphQL` are doing everything for us `loading` and `data`, we're just doing the UI we are not doing any part of the _**fetching**_ and _**JSON**_ and nothing.

&nbsp;

- Now we're going to go and click to go to the `ID page`, to the detail page. We're going to use `Link`.

```javascript
// routes/Home.js
.....
const Home = () => {
  const { loading, data } = useQuery(GET_MOVIES);

  return (
    <>
      {loading && <Loading>Loading...</Loading>}
      {!loading && data.movies && data.movies.map((movie) => <Movie key={movie.id} id={movie.id} />)}
    </>
  );
};

export default Home;
```

```javascript
// components/Movie.js
import { Link } from "react-router-dom";

export default ({ id }) => (
  <div>
    <Link to={`/${id}`}>{id}</Link>
  </div>
);
```

&nbsp;

#### How do we request a query with arguments?

- I want to `get the ID` from the `URL` because later we're gonna come to our API and we're gonna do `movie(id:15048)`... query all that. so we need the `ID`

- Let's get the ID, and we're gonna use the awesome `react-router` hooks.

```javascript
// routes/Home.js
import { useParams } from "react-router";

export default () => {
  const { id } = useParams();
  .....
};
```

&nbsp;

- This query has `arguments` because it needs an `ID`. When your query _**doesn't have any variables**_, you _**don't**_ need to _**write anything special**_ you _**just write the query**_.

- But when your query has a `variable` such as ID, you need to `write a name` to that query for `Apollo`. and what I'm gonna do is a query and this could `name getMovie` so this is only for `Apollo`, is not for our server.

```javascript
// routes/Home.js
import { gql, useQuery } from "@apollo/client";

const GET_MOVIE = gql`
  query getMovie($id: Int!) {
    movie(id: $id) {
      id
      title
      medium_cover_image
      language
      rating
      description_intro
    }
  }
`;
```

- I _**specify the variables**_ that this query needs, so I'm saying this query needs an `ID variable`, and the ID is going to be a `Int`.

&nbsp;

- so this part (`query getMovie($id: xxx)`) of the query is for `Apollo` and this part of the query is the query that goes to my `server`.

- Because `Apollo` is going to help you `check the type` of the variable and then you're gonna `give that variable` to the `actual query` that is gonna _**go to your server**_.

&nbsp;

- What we do is to open up an `options object` and we say `variables` and _**the variable**_ is _**ID**_. our _**API**_ expects an _**ID**_ and that ID is _**required**_ so we need to write it as is on the API.

```javascript
// routes/Home.js
export default () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_MOVIE, {
    variables: { id: Number(id) },
  });
  .....
};
```

&nbsp;

## Apollo Cache

- I want to _**go back**_, and here I'm gonna _**click back**_ to the `same ID` where I was before. There was `no loading` going on.

- This is one of the _**most cool features**_ about Apollo and that it has a `cache`, that means that if `Apollo` gets something, it's gonna `keep it there`.

- Apollo knows _**what you're looking for**_ and _**gives it**_ to you from the `cache` so you _**don't**_ have to _**request that again**_.

  - at first time, `data.movie.title` that will give you an error. because at the beginning, the data is `undefined`, so you always have to ask for data first, you need to see `if data exists`.

&nbsp;

- If you are interested in seeing more about the `Apollo cache`, you can go, install (Apollo dev tools) Apollo client developer tools.

- In this `Apollo dev tools`, you can see the `queries` whatever, and `cache` ... you can see that Apollo is `managing the cache` already.

<p align="center"><img src="https://user-images.githubusercontent.com/66893123/145142538-d937178d-307c-44dd-a7f4-7f3eb805b039.png"  alt="apollo cache" width="942" height="210"></p>

- because when you go somewhere, `Apollo` will _**add this**_ to the `cache`, and if it finds it, it is _**not**_ gonna _**request it**_
