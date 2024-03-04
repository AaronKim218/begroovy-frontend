import { useState, useEffect } from "react";
import PostCard from "../components/Posts/PostCard";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
} from "@mui/material";
import { postApi } from "../api/api";
import { songApi } from "../api/api";
import { PostCreation, Song, Post } from "../main.types";
import { useAppSelector } from "../hooks/use-redux";
import { SearchSongsParams } from "../api/types";
import { skipToken } from '@reduxjs/toolkit/query/react';

export default function Posts() {
    const { data: postsData, error: postsError, refetch } = postApi.useGetAllPostsQuery();
    const [pageStatus, setPageStatus] = useState("LOADING");
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [createPost] = postApi.useCreatePostMutation();
    const userState = useAppSelector((state) => state.user);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (postsData) {
            setPosts(postsData);
            setPageStatus("SUCCESS");
        } else if (postsError) {
            setPageStatus("ERROR");
        }
    }, [postsData, postsError]);

    const PageSuccess = () => (
        <div className="flex flex-col items-center pt-8">
            <h1 className="text-4xl font-extrabold">Posts</h1>
            <div className="flex flex-col items-center pt-8">
                {posts.map((post) => (
                    <PostCard key={post._id} pid={post._id} />
                ))}
            </div>
        </div>
    );

    const openPostModal = () => setIsPostModalOpen(true);
    const closePostModal = () => setIsPostModalOpen(false);

    const handlePostSubmit = (song: Song) => {
        console.log("user", userState);
        const post: PostCreation = {
            creator: userState.user!._id,
            song: song,
            likes: [],
            dislikes: [],
            createdAt: new Date(),
        };
        createPost(post)
            .unwrap()
            .then((data) => {
                console.log(data);
                setRefetchTrigger((current) => current + 1);
            })
            .catch((error) => {
                console.log(error);
            });
        closePostModal();
    };

    useEffect(() => {
        if (refetchTrigger > 0) {
            refetch();
        }
    }, [refetchTrigger, refetch]);

    interface PostModalProps {
        open: boolean;
        handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
        handleSubmit: (song: Song) => void;
    }

    const PostModal = ({ open, handleClose, handleSubmit }: PostModalProps) => {
        const [title, setTitle] = useState("");
        const [artist, setArtist] = useState("");
        const [params, setParams] = useState<SearchSongsParams>();
        const [songs, setSongs] = useState<Song[]>([]);
        const { data: songsResponse, isLoading: songsLoading } = songApi.useSearchSongsQuery(params ?? skipToken);


        useEffect(() => {
            if (songsResponse) {
                console.log("Songs:", songsResponse);
                setSongs(songsResponse);
            }
        }, [songsResponse]);

        const handleSearch = () => {
            // Log to debug
            console.log("Search Params:", {
                title: title,
                artist: artist,
                limit: 10,
                offset: 0,
            });

            setParams({
                title: title,
                artist: artist,
                limit: 10,
                offset: 0,
            });
        };

        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Song Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Artist Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                    />
                    <Button onClick={handleSearch} color="primary" variant="contained">
                        Search
                    </Button>

                    {/* Display search results */}
                    <div className="pt-2">
                        {songsLoading && <p>Loading...</p>}
                        {songs.map((song, index) => (
                            <div key={index} className="my-2 flex items-center">
                                <img
                                    src={song.image}
                                    alt={song.title}
                                    className="mr-2 h-10 w-10"
                                />{" "}
                                {/* Small album cover */}
                                <div className="flex flex-grow flex-col">
                                    <p className="font-semibold">{song.title}</p>{" "}
                                    {/* Song name */}
                                    <p className="text-sm text-gray-600">
                                        {song.artists.map((artist) => artist.name).join(", ")}
                                    </p>{" "}
                                    {/* Artist name */}
                                </div>
                                <Button
                                    onClick={() => handlePostSubmit(song)}
                                    color="primary"
                                    variant="contained"
                                >
                                    Submit
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <>
            {pageStatus === "LOADING" && <div>Loading...</div>}
            {pageStatus === "ERROR" && <div>Error!</div>}
            {pageStatus === "SUCCESS" && (
                <div>
                    <PageSuccess />
                    <button
                        onClick={openPostModal}
                        className="fixed bottom-4 right-4 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                        Add Post
                    </button>

                    <PostModal
                        open={isPostModalOpen}
                        handleClose={closePostModal}
                        handleSubmit={handlePostSubmit}
                    />
                </div>
            )}
        </>
    );
}
