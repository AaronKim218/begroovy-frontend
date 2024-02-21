import { Card, CardContent, CardMedia, Typography, CardActions, Button, useTheme } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { songApi } from '../../api/api';
import { userApi } from '../../api/api';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { postApi } from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function Post({ pid, readOnly = false }) {

    const [pageStatus, setPageStatus] = useState('LOADING');
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const user = useSelector(state => state.user);
    const { data: postData, error: postError, refetch: refetchPost } = postApi.useGetPostByPidQuery(pid);
    const { data: songData, error: songError} = songApi.useGetSongDataBySidQuery(postData?.spotifySongId, {
        skip: !postData,
    });
    const { data: userData, error: userError } = userApi.useGetUserByIdQuery(postData?.creator, {
        skip: !postData,
    });
    const [likePost] = postApi.useLikePostMutation();
    const [dislikePost] = postApi.useDislikePostMutation();
    const [unlikePost] = postApi.useUnlikePostMutation();
    const [undislikePost] = postApi.useUndislikePostMutation();
    const [deletePost] = postApi.useDeletePostMutation();
    const { refetch: refetchAllPosts } = postApi.useGetAllPostsQuery();
    const navigate = useNavigate();

useEffect(() => {
    if (postData && songData && userData) {
        setPageStatus('SUCCESS');
    }
    else if (postError || songError || userError) {
        setPageStatus('ERROR');
    }
}, [postData, songData, userData, postError, songError, userError]);

    const handleLike = () => {
        if (liked) {
            setLiked(false);
            unlikePost({ pid: pid, uid: user._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger(current => current + 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            if (disliked) {
                setDisliked(false);
                undislikePost({ pid: pid, uid: user._id })
                    .unwrap()
                    .then((data) => {
                        setRefetchTrigger(current => current + 1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            setLiked(true);
            likePost({ pid: pid, uid: user._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger(current => current + 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    
    const handleDislike = () => {
        if (disliked) {
            setDisliked(false);
            undislikePost({ pid: pid, uid: user._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger(current => current + 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            if (liked) {
                setLiked(false);
                unlikePost({ pid: pid, uid: user._id })
                    .unwrap()
                    .then((data) => {
                        setRefetchTrigger(current => current + 1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            setDisliked(true);
            dislikePost({ pid: pid, uid: user._id })
                .unwrap()
                .then((data) => {
                    setRefetchTrigger(current => current + 1);
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

    const getDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    const handleDelete = async () => {
        try {
            await deletePost(pid).unwrap();
            // Trigger a refetch of all posts or navigate to the posts list
            refetchAllPosts();
            navigate('/posts'); // Navigate back to the posts list
        } catch (error) {
            console.error('Failed to delete the post:', error);
            // Optionally handle the error state here
        }
    };

    const PageSuccess = () => {

        const theme = useTheme();

        return (
            <Card sx={{ width: 500, height: 600 }}>
                <CardMedia
                sx={{ height: 400 }}
                image={songData.albumCoverImageUrl}
                title={songData.albumName}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">{songData.songName}</Typography>
                    <Typography variant="body2" color="text.secondary">Artist: {songData.artists.map(artist => artist.artistName).join(', ')}</Typography>
                    <Typography variant="body2" color="text.secondary">Album: {songData.albumName}</Typography>
                    <Typography variant="body2" color="text.secondary">Posted by: {userData.firstName} {userData.lastName} on {getDate(postData.createdAt)}</Typography>
                </CardContent>
                <CardActions>
                    {
                        readOnly &&
                        <Typography variant="body2" color="text.secondary">Likes: {postData.likes.length}</Typography>
                    }
                    {
                        readOnly &&
                        <Typography variant="body2" color="text.secondary">Dislikes: {postData.dislikes.length}</Typography>
                    }
                    {
                        !readOnly && 
                        <div className="flex justify-between w-full">
                            <div>
                                <Button size="small" onClick={handleLike} style={{ color: liked ? theme.palette.primary.main : theme.palette.inactive }}>
                                <ThumbUpIcon />
                                    <p>{postData.likes.length}</p>
                                </Button>
                                <Button size="small" onClick={handleDislike} style={{ color: disliked ? theme.palette.primary.main : theme.palette.inactive }}>
                                    <ThumbDownIcon />
                                    <p>{postData.dislikes.length}</p>
                                </Button>
                            </div>
                            {
                                user._id === postData.creator &&
                                <Button size="small" onClick={handleDelete} color="error">
                                    <DeleteIcon />
                                    <p>Delete</p>
                                </Button>
                            }
                        </div>
                    }
                </CardActions>
            </Card>
        );
    }

    switch (pageStatus) {
        case 'LOADING':
            return <div>Loading...</div>;
        case 'ERROR':
            return <div>Error!</div>;
        case 'SUCCESS':
            return <PageSuccess />;
        default:
            return <div>Something went wrong!</div>;
    }
}