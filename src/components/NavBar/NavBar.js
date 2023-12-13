import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { authApi } from '../../api/api';
import { useDispatch } from 'react-redux';
import { resetUser } from '../../store/userSlice';

function Navbar() {
    const navigate = useNavigate();
    const [logout] = authApi.useLogoutMutation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        logout()
            .unwrap()
            .then((originalPromiseResult) => {
                console.log('originalPromiseResult');
                console.log(originalPromiseResult);
                dispatch(resetUser());
            })
        navigate('/');
    };


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>BeGroovy</Typography>                
                <Button color="inherit" component={RouterLink} to="/posts">Posts</Button>
                <Button color="inherit" component={RouterLink} to="/groups">Groups</Button>
                <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                <IconButton color="inherit" component={RouterLink} to="/profile">
                    <AccountCircleIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;