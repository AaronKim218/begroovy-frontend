import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { groupApi } from '../api/api';
import {useState, useEffect } from 'react';

export default function Groups() {
    const [pageStatus, setPageStatus] = useState('LOADING');
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const { data: groups, error } = groupApi.useGetMemberGroupsQuery(user._id);

    useEffect(() => {
        if (groups) {
            console.log('groups brothat');
            console.log(groups);
            setPageStatus('SUCCESS');
        } else if (error) {
            setPageStatus('ERROR');
        }
    }, [groups, error]);

    useEffect(() => {
        if (!user._id) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleGo = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    const Success = () => {
        return (
            <div className='flex flex-col items-center'>
                <h1>Groups Page</h1>
                <ul>
                    {groups.map(group => (
                        <li key={group._id}>
                            Group ID: {group._id}
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => handleGo(group._id)}
                            >
                                Go
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    switch (pageStatus) {
        case 'LOADING':
            return <p>Loading...</p>;
        case 'ERROR':
            return <p>Error loading groups</p>;
        case 'SUCCESS':
            return <Success />;
        default:
            return <p>Something went wrong</p>;
    }
}