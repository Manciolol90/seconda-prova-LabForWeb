export interface Movie {
  id: number; // ID TMDB
  tmdbId?: number; // verrà inserito nel DB
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;

  dbId?: number; // ID interno JSON server
}
