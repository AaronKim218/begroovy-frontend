import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { songApi } from '../../api/api';
import { userApi } from '../../api/api';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { postApi } from '../../api/api';

export default function Post({ pid }) {

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
        } else {
            setLiked(true);
            setDisliked(false);
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
        } else {
            setDisliked(true);
            setLiked(false);
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

    const PageSuccess = () => {
        return (
            <Card sx={{ maxWidth: 500 }}>
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
                    <Button size="small" onClick={handleLike} color={liked ? 'primary' : 'secondary'}>
                        <ThumbUpIcon />
                        <p>{postData.likes.length}</p>
                    </Button>
                    <Button size="small" onClick={handleDislike} color={disliked ? 'primary' : 'secondary'}>
                        <ThumbDownIcon />
                        <p>{postData.dislikes.length}</p>
                    </Button>
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