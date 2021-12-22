# 🍯 movieQL Apollo Client Course

## Suggestions & Optional Chaining

- We have another query that you can do, that query is `suggestions`. What you can do is just put it here, just like on the playground.

```javascript
// routes/Detail.js
const GET_MOVIE = gql`
  query getMovie($id: Int!) {
    movie(id: $id) {
      id
      title
      ....
    }
    suggestions(id: $id) {
      id
      medium_cover_image
    }
  }
`;
```

&nbsp;

- If you look at something called `optional chaining`(js), it's the new feature. You can just say _**data exists?**_ if data exists then _**movie exists?**_ [like this](https://github.com/salybu/movieQL/commit/1e311be7a38e612d7ba3d6cc617fefc780f4465e) is about optional chaining

```javascript
<Movies>
  {data?.movies?.map((movie) => (
    <Movie key={movie.id} id={movie.id} bg={movie.medium_cover_image} />
  ))}
</Movies>
```

&nbsp;

## Local State in Apollo Cache

- Last thing is `local state`. Local state means that you can `modify the data` that came from the `API` and they are on our `Apollo cache`. now what happens if you need to _**do something**_ with the _**data that you got**_.

- What happens if you want to let the `user interact` with that movie specifically, like you want to `add a dynamic field`.

&nbsp;

- go inside of the `Apollo cache` and I want to `create a field` called `isLiked`. so I want to `put that inside` or `combine that` with what I got from the `API`.
- so _**What I get from the API**_ is the `movie` like this, I wanna have my `own field` called `isLiked` and that will be T/F.

```javascript
// routes/Detail.js
const GET_MOVIE = gql`
  query getMovie($id: Int!) {
    movie(id: $id) {
      ....
      isLiked @client
    }
  }
`;
```

&nbsp;

## add Local-only Fields and Apollo Client Resolvers

- `Apollo client` has many `configuration options` and one of them is called `resolvers`. This is basically like a resolver on backend, on the API where you resolve a field. This is the same but on the `Client`, we can resolve fields as well so for

```javascript
// apollo.js
const client = new ApolloClient({
  uri: "https://movieql2.vercel.app/",
  resolvers: {
    Movie: {
      isLiked: () => false,
    },
  },
});
```

- this `Movie` has to come from the name of the type of your `API`. It has to be the same name _(Movie type in API schema.grapql)_, and here I'm gonna _**make a resolver**_ of a field `isLiked`, and _**function**_ by default return false.

&nbsp;

- and in `GET_MOVIES` query, also we can ask for `isLiked`.

```javascript
// routes/Home.js
const GET_MOVIES = gql`
  {
    movies {
      id
      medium_cover_image
      isLiked @client
    }
  }
`;
```

- If the error message is like this below, this is our _**API**_ telling us that _**cannot query isLiked**_, because isLiked is _**not on the backend**_ so we need to tell _**GraphQL**_ that `isLiked` is `on the client`

  > Error message: cannot query field "isLiked" on type "Movie" <br>
  > 400 Error: POST https://movieql2.vercel.app/ 400

&nbsp;

- We need to connect our `button` to `isLiked` and then we have `isLiked` coming from `front-end` _**not back-end**_. We're `combining data` from the _**API**_ and data from our _**front-end**_ just by `making a new type`.

&nbsp;

- You can _**update**_ if you want to your _**local state**_ by `creating mutations` on the `Client`.

- You can `create mutations` on the client. _**Mutation**_ in this case behaves exactly like a mutation _**on your backend**_, that gets `arguments`, `context`, everything. That's what we're gonna use to _**modify this isLiked**_

```javascript
// apollo.js
const client = new ApolloClient({
  uri: "https://movieql2.vercel.app/",
  resolvers: {
    Mutation: {
      toggleLikeMovie: (_, { id, isLiked }, { cache }) => {
        const myMovie = {
          __typename: "Movie",
          id: `${id}`,
          isLiked: `${isLiked}`,
        };
        cache.modify({
          id: cache.identify(myMovie),
          fields: {
            isLiked(isLiked) {
              return !isLiked;
            },
          },
        });
      },
    },
  },
});
```

- what I was writing in `ApolloClient`, is very similar what I was writing on the back-end

  - _**First paramenter**_ is a `resolver` like on my back-end so I get \_ that I ignore, I get some `arguments` that I want, and also I get `context` and on the context I want to get is the `cache`.

&nbsp;

- so in `resolvers`, first I created a type called `Movie` with a boolean function, and now I create a `mutation type` and create a new function called `toggleLikeMovie`. and this behaves exactly like if it was on a server. It's a `GraphQL resolver`.

&nbsp;

## use Mutation in Apollo Client

- I need to tell my `Apollo` that `this mutation` is on the `client` because we _**don't**_ want to _**send this mutation to the back-end**_.

- We're gonna use mutation and `useMutation` will give me `a mutation` on the _**first element of the array**_. you can name it whatever

```javascript
// components/Movie.js
export default ({ id, bg, isLiked }) => {
  const [toggleMovie] = useMutation(LIKE_MOVIE, {
    variables: { id: parseInt(id), isLiked },
  });
  return (
    <Container>
      <Link to={`/${id}`}>
        <Poster bg={bg} />
      </Link>
      <button onClick={toggleMovie}>{isLiked ? "Unlike" : "Like"}</button>
    </Container>
  );
};
```

&nbsp;

- Let's `toggleMovie`. As button onClick props written, we're gonna `execute toggleMovie`. I'm _**creating a mutation**_ as if it was on the back-end but I'm sending it to the `Client`.

- Apollo is going to `look for this name` here _(Movie.js query mutation)_ and is going to `find it`_(apollo.js)_ so it's gonna `execute it`.

```javascript
// components/Movie.js
const LIKE_MOVIE = gql`
  mutation toggleLikeMovie($id: Int!, $isLiked: Boolean!) {
    toggleLikeMovie(id: $id, isLiked: $isLiked) @client
  }
`;
```

```javascript
// apollo.js
const client = new ApolloClient({
  uri: "https://movieql2.vercel.app/",
   Mutation: {
      toggleLikeMovie: (_, { id, isLiked }, { cache }) => {
      ........
      },
    },
});
```

&nbsp;

- just like when in the _Home.js_, I am asking for `isLiked` _(Home.js)_, Apollo is going to go and _**look into the type**_ and _**resolve that**_

```javascript
// routes/Home.js
const GET_MOVIES = gql`
  {
    movies {
      id
      medium_cover_image
      isLiked @client
    }
  }
`;
....
const Home = () => {
  const { loading, data } = useQuery(GET_MOVIES);

  return (
      <Movies>
        {data?.movies?.map((movie) => (
          <Movie
            key={movie.id}
            id={movie.id}
            isLiked={movie.isLiked}
            bg={movie.medium_cover_image}
          />
        ))}
      </Movies>
  );
};

export default Home;
```

```javascript
// apollo.js
const client = new ApolloClient({
  uri: "https://movieql2.vercel.app/",
  resolvers: {
    Movie: {
      isLiked: () => false,
    },
  },
});
```

&nbsp;

- when We execute console.log(cache), `cache` gets many things what we want. We want to _**use this cache**_ that we _**get on the context**_ to `modify` each one of them

<p align="center"><img src="https://user-images.githubusercontent.com/66893123/145339731-4bfd0737-4981-435f-9665-99772326d361.PNG"  alt="apollo cache" width="804" height="255"></p>

&nbsp;

- If you wanted you could also `change any data` you want, just like that we're `modifying the data` that we got from the `API` but also we're `combining that` with our `local state`

&nbsp;

## request with the same ID for Apollo

- It's supposed to change because _**they are the same**_, but the thing is that `Apollo` _**doesn't know**_ that they are the same.

  - we need to _**tell Apollo**_ that this movie detail _**is the same**_ as this movie list. We only need to `add ID` on the detail.

  - so when we request the `movie with ID`, _**Apollo will know**_ that this thing `is connected` to this one.

- `Apollo` knows that they're _**both the same**_ because we are `requesting the ID` and they have the `same ID`.

&nbsp;

- It's a very useful thing to know how to `change your data Locally`.

- Don't forget you _**should always request**_ your documents with an `ID` so Apollo knows that _**they are the same**_

- We created a `new field` on a `movie resolver`. This has to be the _**same name**_ from your _**API**_ and then we created `a mutation` like if we were on the backend.
