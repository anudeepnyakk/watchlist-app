export type Show = {
    id: string;
    title: string;
    watched: boolean;
    addedAt: string;
  }
  
  export type FilterType = 'all' | 'watched' | 'unwatched';