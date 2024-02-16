import { useState, useEffect } from 'react';
import Post from '../components/Posts/Post';
import { postApi } from '../api/api';

export default function ReadOnlyPosts() {
    const { data: posts, error } = postApi.useGetAllPostsQuery();
    const [pageStatus, setPageStatus] = useState('LOADING');

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
                {posts.map(post => <Post key={post._id} pid={post._id} readOnly={true} />)}
            </div>
        </div>
    );

    return (
        <>
            {pageStatus === 'LOADING' && <div>Loading...</div>}
            {pageStatus === 'ERROR' && <div>Error!</div>}
            {pageStatus === 'SUCCESS' && <PageSuccess />}
        </>
    );
}