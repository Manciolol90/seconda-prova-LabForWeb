export interface Movie {
  id: number;
  tmdbId?: number;
  dbId?: number;

  title: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count?: number;

  adult?: boolean;
  genre_ids?: number[];
  original_language?: string;
  popularity?: number;
  video?: boolean;
}
