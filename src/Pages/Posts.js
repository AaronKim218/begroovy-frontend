import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Posts() {

    const user = useSelector(state => state.user);


    useEffect(() => {
        console.log("Posts Page");
        console.log(user);
    }, [user]);

    return (
        <div>
            <h1>Posts Page</h1>
        </div>
    );
}