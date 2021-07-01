import { useParams,useHistory } from 'react-router';
import DetailedTodo from "../../Components/Todo/DetailedTodo";
import useRedirectOnSessionEnd from '../../CustomHooks/useRedirectOnSessionEnd';

function DetailedTodoPage(props) {
    useRedirectOnSessionEnd();
    const params = useParams();
    const history = useHistory();
    function redirectOnTodoSubmit() {
        history.push('/todo');
    }
    return (
        <DetailedTodo paramId={params.itemId} redirectOnTodoSubmit={redirectOnTodoSubmit} />
    )
}

export default DetailedTodoPage