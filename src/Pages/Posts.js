import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import Post from "../components/Posts/Post";
import { postApi } from "../api/api";

export default function Posts() {

    // const user = useSelector(state => state.user);
    const { data: posts, error } = postApi.useGetAllPostsQuery();
    const [pageStatus, setPageStatus] = useState('LOADING');

    useEffect(() => {
        if (posts) {
            setPageStatus('SUCCESS');
        } else if (error) {
            setPageStatus('ERROR');
        }
    }, [posts, error]);

    const PageSuccess = () => {
        return (
            <div className=" flex flex-col items-center pt-8">
                <h1 className=" text-4xl font-extrabold">Posts</h1>
                <div className=" flex flex-col items-center pt-8">
                    {posts.map(post => <Post key={post._id} pid={post._id} />)}
                </div>
            </div>
        )
    };

    switch (pageStatus) {
        case 'LOADING':
            return <div>Loading...</div>;
        case 'ERROR':
            return <div>Error!</div>;
        case 'SUCCESS':
            return <PageSuccess />;
        default:
            return <div>Something went wrong...</div>;
    }
}