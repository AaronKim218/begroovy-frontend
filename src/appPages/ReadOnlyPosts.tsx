import { useState, useEffect } from 'react';
import PostCard from '../components/Posts/PostCard';
import { postApi } from '../api/api';
import { Post } from '../main.types';

export default function ReadOnlyPosts() {
    const { data: postsData, error: postsError } = postApi.useGetAllPostsQuery();
    const [pageStatus, setPageStatus] = useState('LOADING');
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (postsData) {
            setPosts(postsData);
            setPageStatus('SUCCESS');
        } else if (postsError) {
            setPageStatus('ERROR');
        }
    }, [postsData, postsError]);

    const PageSuccess = () => (
        <div className="flex flex-col items-center pt-8">
            <h1 className="text-4xl font-extrabold">Posts</h1>
            <div className="flex flex-col items-center pt-8">
                {posts.map(post => <PostCard key={post._id} pid={post._id} readOnly={true} />)}
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