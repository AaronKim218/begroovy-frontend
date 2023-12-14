import { useState, useEffect } from 'react';
import Post from '../components/Posts/Post';
import { Dialog, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { postApi } from '../api/api';
import { songApi } from '../api/api';
import { useSelector } from 'react-redux';

export default function Posts() {
    const { data: posts, error, refetch } = postApi.useGetAllPostsQuery();
    const [pageStatus, setPageStatus] = useState('LOADING');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [createPost] = postApi.useCreatePostMutation();
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (posts) {
            setPageStatus('SUCCESS');
        } else if (error) {
            setPageStatus('ERROR');
        }
    }, [posts, error]);

    const PageSuccess = () => (
        <div className="flex flex-col items-center pt-8">
            <h1 className="text-4xl font-extrabold">Posts</h1>
            <div className="flex flex-col items-center pt-8">
                {posts.map(post => <Post key={post._id} pid={post._id} />)}
            </div>
        </div>
    );

    const openPostModal = () => setIsPostModalOpen(true);
    const closePostModal = () => setIsPostModalOpen(false);

    const handlePostSubmit = (song) => {
        const body = {
            creator: user._id,
            spotifySongId: song.songId,
            likes: [],
            dislikes: [],
            createdAt: new Date(),
            spotifyArtistIds: song.artists.map(artist => artist.artistId),
        };
        createPost(body)
            .unwrap()
            .then((data) => {
                console.log(data);
                setRefetchTrigger(current => current + 1);
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

    const PostModal = ({ open, handleClose, handleSubmit }) => {
        const [songName, setSongName] = useState('');
        const [artistName, setArtistName] = useState('');
        const [searchParams, setSearchParams] = useState(null);
        const [songResults, setSongResults] = useState([]);
    
        const { data: songs, isLoading: isSongLoading } = songApi.useSearchSongsQuery(searchParams, {
            skip: !searchParams,
        });
    
        useEffect(() => {
            if (songs) {
                setSongResults(songs);
            }
        }, [songs]);
    
        const handleSearch = () => {
            // Log to debug
            console.log('Search Params:', { song: songName, artist: artistName, limit: 10, offset: 0 });
        
            setSearchParams({ 
                song: songName, 
                artist: artistName, 
                limit: 10, 
                offset: 0 
            });
        };
    
        // const handleResultSubmit = (selectedSong) => {
        //     // Implement logic to handle submission of the selected song
        //     console.log('Selected song for submission:', selectedSong);
        //     // You might want to call handleSubmit here or perform other logic
        // };
    
        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Song Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                    />
                    <TextField
                        label="Artist Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                    />
                    <Button onClick={handleSearch} color="primary" variant="contained">
                        Search
                    </Button>
    
                    {/* Display search results */}
                    <div className="pt-2">
                        {isSongLoading && <p>Loading...</p>}
                        {songResults.map((song, index) => (
                            <div key={index} className="flex items-center my-2">
                                <img src={song.albumCoverImageUrl} alt={song.songName} className="w-10 h-10 mr-2" /> {/* Small album cover */}
                                <div className="flex flex-col flex-grow">
                                    <p className="font-semibold">{song.songName}</p> {/* Song name */}
                                    <p className="text-sm text-gray-600">{song.artists.map(artist => artist.artistName).join(', ')}</p> {/* Artist name */}
                                </div>
                                <Button onClick={() => handlePostSubmit(song)} color="primary" variant="contained">
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
            {pageStatus === 'LOADING' && <div>Loading...</div>}
            {pageStatus === 'ERROR' && <div>Error!</div>}
            {pageStatus === 'SUCCESS' && (
                <div>
                    <PageSuccess />
                    <button
                        onClick={openPostModal}
                        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Add Post
                    </button>

                    <PostModal 
                        open={isPostModalOpen} 
                        handleClose={closePostModal} 
                        handleSubmit={handlePostSubmit}
                    />
                </div>
            )
            }
        </>
    );
}