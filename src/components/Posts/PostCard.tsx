import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
    useTheme,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { userApi } from "../../api/api";
import { useAppSelector } from "../../hooks/use-redux";
import { useState, useEffect } from "react";
import { postApi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Post, User } from "../../main.types";
import { skipToken } from '@reduxjs/toolkit/query/react';

interface PostCardProps {
    pid: string;
    readOnly?: boolean;
}

export default function PostCard({ pid, readOnly = false }: PostCardProps) {
    const [pageStatus, setPageStatus] = useState("LOADING");
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const userState = useAppSelector((state) => state.user);
    const {
        data: postData,
        error: postError,
        refetch: refetchPost,
    } = postApi.useGetPostByPidQuery(pid);
    console.log(postData);
    const [likePost] = postApi.useLikePostMutation();
    const [dislikePost] = postApi.useDislikePostMutation();
    const [unlikePost] = postApi.useUnlikePostMutation();
    const [undislikePost] = postApi.useUndislikePostMutation();
    const [deletePost] = postApi.useDeletePostMutation();
    const { refetch: refetchAllPosts } = postApi.useGetAllPostsQuery();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post>();
    const [user, setUser] = useState<User>();
    const { data: userData, error: userError } = userApi.useGetUserByIdQuery(post?.creator ?? skipToken);

    useEffect(() => {
        if (postData) {
            setPost(postData);
        }

        if (userData) {
            setUser(userData);
        }
        console.log("useEffect happeining");
        console.log(postData);
        console.log(userData);
        if (postData && userData) {
            setPageStatus("SUCCESS");
        } else if (postError || userError) {
            setPageStatus("ERROR");
        }
    }, [postData, userData, postError, userError]);

    const handleLike = () => {
        if (liked) {
            setLiked(false);
            unlikePost({ pid: pid, uid: userState.user!._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger((current) => current + 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            if (disliked) {
                setDisliked(false);
                undislikePost({ pid: pid, uid: userState.user!._id })
                    .unwrap()
                    .then((data) => {
                        setRefetchTrigger((current) => current + 1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            setLiked(true);
            likePost({ pid: pid, uid: userState.user!._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger((current) => current + 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleDislike = () => {
        if (disliked) {
            setDisliked(false);
            undislikePost({ pid: pid, uid: userState.user!._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger((current) => current + 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            if (liked) {
                setLiked(false);
                unlikePost({ pid: pid, uid: userState.user!._id })
                    .unwrap()
                    .then((data) => {
                        setRefetchTrigger((current) => current + 1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            setDisliked(true);
            dislikePost({ pid: pid, uid: userState.user!._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger((current) => current + 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        if (refetchTrigger > 0) {
            refetchPost();
        }
    }, [refetchTrigger, refetchPost]);

    const getDate = (date: string | number | Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleDelete = async () => {
        try {
            await deletePost(pid).unwrap();
            // Trigger a refetch of all posts or navigate to the posts list
            refetchAllPosts();
            navigate("/posts"); // Navigate back to the posts list
        } catch (error) {
            console.error("Failed to delete the post:", error);
            // Optionally handle the error state here
        }
    };

    const PageSuccess = () => {
        const theme = useTheme();
        console.log("post", postData);

        return (
            <Card sx={{ width: 500, height: 600 }}>
                <CardMedia
                    sx={{ height: 400 }}
                    image={post!.song.image}
                    title={post!.song.album}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {post!.song.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Artist:{" "}
                        {post!.song.artists.map((artist) => artist.name).join(", ")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Album: {post!.song.album}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Posted by: {user!.firstName} {user!.lastName} on{" "}
                        {getDate(post!.createdAt)}
                    </Typography>
                </CardContent>
                <CardActions>
                    {readOnly && (
                        <Typography variant="body2" color="text.secondary">
                            Likes: {post!.likes.length}
                        </Typography>
                    )}
                    {readOnly && (
                        <Typography variant="body2" color="text.secondary">
                            Dislikes: {post!.dislikes.length}
                        </Typography>
                    )}
                    {!readOnly && (
                        <div className="flex w-full justify-between">
                            <div>
                                <Button
                                    size="small"
                                    onClick={handleLike}
                                    style={{
                                        color: liked
                                            ? theme.palette.primary.main
                                            : theme.palette.secondary.main,
                                    }}
                                >
                                    <ThumbUpIcon />
                                    <p>{post!.likes.length}</p>
                                </Button>
                                <Button
                                    size="small"
                                    onClick={handleDislike}
                                    style={{
                                        color: disliked
                                            ? theme.palette.primary.main
                                            : theme.palette.secondary.main,
                                    }}
                                >
                                    <ThumbDownIcon />
                                    <p>{post!.dislikes.length}</p>
                                </Button>
                            </div>
                            {userState.user!._id === post!.creator && (
                                <Button size="small" onClick={handleDelete} color="error">
                                    <DeleteIcon />
                                    <p>Delete</p>
                                </Button>
                            )}
                        </div>
                    )}
                </CardActions>
            </Card>
        );
    };

    switch (pageStatus) {
        case "LOADING":
            return <div>Loading...</div>;
        case "ERROR":
            return <div>Error!</div>;
        case "SUCCESS":
            return <PageSuccess />;
        default:
            return <div>Something went wrong!</div>;
    }
}
