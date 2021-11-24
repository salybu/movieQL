import { getMovie, getMovies, getSuggestions } from "./db";

const resolvers = {
  Query: {
    movie: (_, { id }) => getMovie(id),
    movies: (_, { rating, limit }) => getMovies(limit, rating),
    suggestions: (_, { id }) => getSuggestions(id),
  },
};

export default resolvers;
