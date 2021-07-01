import Todo from "../../Components/Todo/Todo";
import useRedirectOnSessionEnd from "../../CustomHooks/useRedirectOnSessionEnd";

function TodoPage(props) {
    useRedirectOnSessionEnd();
    return (
        <Todo />
    )
}

export default TodoPage