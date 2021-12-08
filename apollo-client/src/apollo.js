import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://movieql2.vercel.app/",
  resolvers: {
    Movie: {
      isLiked: () => false,
    },
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
  cache: new InMemoryCache({
    typePolicies: {
      Movie: {
        fields: {
          isLiked: {
            merge(existing, incoming) {
              if (existing) {
                return existing;
              } else {
                return incoming;
              }
            },
          },
        },
      },
    },
  }),
});

export default client;
