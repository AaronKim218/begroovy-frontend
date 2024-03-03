import { useState, useEffect } from "react";
import Post from "../components/Posts/Post";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { postApi } from "../api/api";
import { songApi } from "../api/api";
import { useSelector } from "react-redux";

export default function Posts() {
  const { data: posts, error, refetch } = postApi.useGetAllPostsQuery();
  const [pageStatus, setPageStatus] = useState("LOADING");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [createPost] = postApi.useCreatePostMutation();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (posts) {
      setPageStatus("SUCCESS");
    } else if (error) {
      setPageStatus("ERROR");
    }
  }, [posts, error]);

  const PageSuccess = () => (
    <div className="flex flex-col items-center pt-8">
      <h1 className="text-4xl font-extrabold">Posts</h1>
      <div className="flex flex-col items-center pt-8">
        {posts.map((post) => (
          <Post key={post._id} pid={post._id} />
        ))}
      </div>
    </div>
  );

  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);

  const handlePostSubmit = (song) => {
    console.log("user", user);
    const body = {
      creator: user.user._id,
      song: song,
      likes: [],
      dislikes: [],
      createdAt: new Date(),
      artists: song.artists,
    };
    createPost(body)
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

  const PostModal = ({ open, handleClose, handleSubmit }) => {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [searchParams, setSearchParams] = useState(null);
    const [songResults, setSongResults] = useState([]);

    const { data: songs, isLoading: isSongLoading } =
      songApi.useSearchSongsQuery(searchParams, {
        skip: !searchParams,
      });

    useEffect(() => {
      if (songs) {
        console.log("Songs:", songs);
        setSongResults(songs);
      }
    }, [songs]);

    const handleSearch = () => {
      // Log to debug
      console.log("Search Params:", {
        title: title,
        artist: artist,
        limit: 10,
        offset: 0,
      });

      setSearchParams({
        title: title,
        artist: artist,
        limit: 10,
        offset: 0,
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
            {isSongLoading && <p>Loading...</p>}
            {songResults.map((song, index) => (
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
