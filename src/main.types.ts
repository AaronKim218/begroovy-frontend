export interface UserCreation {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface User extends UserCreation {
    _id: string;
}

export interface Artist {
    name: string;
    spotifyId: string;
};

export interface Song {
    spotifyId: string;
    title: string;
    artists: Artist[];
    album: string;
    image: string;
};

export interface PostCreation {
    creator: string;
    song: Song;
    likes: string[];
    dislikes: string[];
    createdAt: Date;
};

export interface Post extends PostCreation {
    _id: string;
};
