import Profile from "../../Components/Auth/Profile";
import useRedirectOnSessionEnd from "../../CustomHooks/useRedirectOnSessionEnd";

function ProfilePage(props) {
    useRedirectOnSessionEnd();
    return (
        <Profile />
    )
}

export default ProfilePage