import Habits from '../../Components/Habits/Habits';
import useRedirectOnSessionEnd from '../../CustomHooks/useRedirectOnSessionEnd';


function HabitsPage(props) {
    useRedirectOnSessionEnd();
    return (
        <Habits />
    )
}

export default HabitsPage