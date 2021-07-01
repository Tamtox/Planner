import AddNewTodo from "../../Components/Todo/AddNewTodo";
import { useHistory } from "react-router";
import useRedirectOnSessionEnd from "../../CustomHooks/useRedirectOnSessionEnd";

function AddNewTodoPage(props) {
    useRedirectOnSessionEnd();
    const history = useHistory();
    function redirectOnTodoSubmit() {
        history.push('/todo');
    }
    return (
        <AddNewTodo redirectOnTodoSubmit={redirectOnTodoSubmit} />
    )
}

export default AddNewTodoPage