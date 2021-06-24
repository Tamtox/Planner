import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle,faCircle,faCheckCircle,faEdit} from '@fortawesome/free-regular-svg-icons';
import './Todoitem.scss';
import {toDoActions} from '../../Store/Store';

function ToDoItem(props) {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const dispatch = useDispatch();
    const [creationDate,targetDate] = [new Date(props.creationDate).toLocaleString(),new Date(props.targetDate).toLocaleString()];
    // Toggle Todo status
    async function changeTodoStatus() {
        await dispatch(toDoActions.changeToDoStatus(props.id));
        axios.request({
            method: "patch",
            url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList/${props.id}.json?auth=${token}`,
            data: props.status === 'Pending'?{'status':'Complete'}:{'status':'Pending'},
        }).catch(err=>{
            console.log(err.response)
            alert(err)
        })
    }
    // Delete Todo
    async function deleteToDo() {
        await dispatch(toDoActions.removeToDo(props.id));
        axios.request({
            method: "delete",
            url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList/${props.id}.json?auth=${token}`,
        }).catch(err=>{
            alert(err)
        })
    }
    return(
        <div className="toDoItem">
            <h2 className='toDoItemTitle'>{props.title}</h2>
            <div className='toDoItemCreationDate'>
                <p>Creation Date</p>
                <p>{creationDate}</p>
            </div>
            {props.targetDate && <div className='toDoItemTargetDate'>
                <p>Target Date</p>
                <p>{targetDate}</p>
            </div>}
            <div className='todoItemIcons'>
                <FontAwesomeIcon onClick={changeTodoStatus} className={`changeTodoStatusIcon hoverFilter ${props.status}`}  icon={props.status === 'Pending'?faCircle:faCheckCircle} />
                <Link to={`/todo/${props.id}`} className='linkToDetailedTodo link'><FontAwesomeIcon className='iconToDetailedTodo hoverFilter' icon={faEdit} /></Link>
                <FontAwesomeIcon onClick={deleteToDo} className='deleteTodoIcon hoverFilter'  icon={faTimesCircle} />
            </div>
        </div>
    )
}

export default ToDoItem