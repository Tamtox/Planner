import Schedule from "../Components/Schedule/Schedule";
import useRedirectOnSessionEnd from "../CustomHooks/useRedirectOnSessionEnd";

function SchedulePage(props) {
    useRedirectOnSessionEnd();
    return (
        <Schedule />
    )
}

export default SchedulePage