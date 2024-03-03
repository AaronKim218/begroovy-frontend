export type User = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type Artist = {
  name: string;
  spotifyId: string;
};

export type Song = {
  spotifyId: string;
  title: string;
  artists: Artist[];
  album: string;
  image: string;
};

export type Post = {
  _id: string;
  creator: User;
  song: Song;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
};
