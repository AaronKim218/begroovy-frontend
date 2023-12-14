import { Button } from '@mui/material';

export default function Home() {
    return (
        <div className="flex justify-center items-center h-screen bg-no-repeat bg-cover bg-center" 
             style={{ backgroundImage: `url(illustration.svg)` }}>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-black mb-4">Time to get Groovy.</h1>
                <Button variant="contained" color="primary" href="/login">
                    Get Started
                </Button>
            </div>
        </div>
    );
}