import { useState, useEffect } from "react";
import { groupApi } from "../api/api";
import { useParams } from "react-router-dom";
import { TextField, Button } from '@mui/material';
import { useSelector } from "react-redux";

const Success = ({ group, user, handleAddCommentClick, showAddComment, newComment, handleCommentChange, handleCommentSubmit, handleRemoveUser }) => {
    const sortedComments = group.comments.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return (
        <div className='flex flex-col items-center'>
            <h1>ArtistGroup Page</h1>
            {showAddComment ? (
                <div>
                    <TextField
                        label="Message"
                        value={newComment}
                        onChange={handleCommentChange}
                        margin="normal"
                        fullWidth
                    />
                    <Button onClick={handleCommentSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </div>
            ) : (
                <Button onClick={handleAddCommentClick} variant="contained" color="primary">
                    Add Comment
                </Button>
            )}

            <div>
                {sortedComments.map((comment, index) => (
                    <div className="flex" key={index}>
                        {user.role === 'ARTIST' && user.spotifyId === group.artistId && (
                            <Button onClick={() => handleRemoveUser(comment.uid)} variant="contained" color="error">
                                Remove User
                            </Button>
                        )}
                        <p className=" pr-2">User ID: {comment.uid}</p>
                        <p className=" pr-2">Message: {comment.comment}</p>
                        <p>Posted on: {new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function ArtistGroup() {
    const [pageStatus, setPageStatus] = useState('LOADING');
    const [showAddComment, setShowAddComment] = useState(false);
    const [newComment, setNewComment] = useState('');
    const { id } = useParams();
    const { data: group, error, refetch } = groupApi.useGetGroupByIdQuery(id);
    const [addComment] = groupApi.useAddCommentMutation();
    const user = useSelector(state => state.user);
    const [removeMember] = groupApi.useRemoveMemberMutation();

    useEffect(() => {
        if (group) {
            setPageStatus('SUCCESS');
        } else if (error) {
            setPageStatus('ERROR');
        }
    }, [group, error]);

    const handleAddCommentClick = () => {
        setShowAddComment(true);
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRemoveUser = async (uid) => {
        console.log('removing user');
        await removeMember({ gid: id, uid: uid })
            .unwrap()
            .then(() => refetch())
            .catch(console.error);
    };

    const handleCommentSubmit = async () => {
        await addComment({ gid: id, body: { uid: user._id, comment: newComment } })
            .unwrap()
            .then(() => refetch())
            .catch(console.error);

        setNewComment('');
        setShowAddComment(false);
    };

    switch (pageStatus) {
        case 'LOADING':
            return <p>Loading...</p>;
        case 'ERROR':
            return <p>Error loading group</p>;
        case 'SUCCESS':
            return <Success 
                group={group}
                user={user}
                handleAddCommentClick={handleAddCommentClick}
                showAddComment={showAddComment}
                newComment={newComment}
                handleCommentChange={handleCommentChange}
                handleCommentSubmit={handleCommentSubmit}
                handleRemoveUser={handleRemoveUser}
            />;
        default:
            return <p>Something went wrong</p>;
    }
}