import Journal from "../../Components/Journal/Journal";
import useRedirectOnSessionEnd from "../../CustomHooks/useRedirectOnSessionEnd";

function JournalPage(props) {
    useRedirectOnSessionEnd();
    return (
        <Journal />
    )
}

export default JournalPage