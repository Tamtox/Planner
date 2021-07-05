import {useSelector,useDispatch} from 'react-redux';
import { useRef,useEffect,useState} from 'react';
import {Link,useHistory,useLocation} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Todo.scss';
import ToDoItem from './TodoItem';
import Loading from '../Misc/Loading';
import { toDoActions } from '../../Store/Store';

function sortList(list,sortQuery,searchQuery) {
    if(sortQuery === 'dateAsc') {
        list = list.sort((itemA,itemB)=> new Date(itemA.creationDate) - new Date(itemB.creationDate))
    } else if(sortQuery === 'dateDesc') {
        list = list.sort((itemA,itemB)=> new Date(itemB.creationDate) - new Date(itemA.creationDate))
    } else if(sortQuery === 'statusPend') {
        list = list.filter(item=>item.status === 'Pending')
    } else if(sortQuery === 'statusComp') {
        list = list.filter(item=>item.status === 'Complete')
    }
    if(!!searchQuery) {
        list = list.filter(item=>item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list
}

function Todo(props) {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const toDoList = useSelector(state=>state.toDoSlice.toDoList);
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    // Sorting by query params
    const [sortRef,searchRef] = [useRef(),useRef()];
    const [history,location] = [useHistory(),useLocation()];
    const queryParams = new URLSearchParams(location.search);
    const [sortQuery,searchQuery] = [queryParams.get('sort'),queryParams.get('search')] 
    const sortedList = sortList([...toDoList],sortQuery,searchQuery);
    function setSortQuery() {
        const [sortInput,searchInput] = [sortRef.current.value,!!searchRef.current?searchRef.current.value:searchRef.current];
        if(!!sortInput) {
            if(!!searchInput) {
                history.push(`/todo?sort=${sortInput}&search=${searchInput}`);
            } 
            else if(!!searchInput === false) {
                history.push(`/todo?sort=${sortInput}`);
            }
        } 
        else if(!!sortInput === false) {
            if(!!searchInput) {
                history.push(`/todo?search=${searchInput}`);
            } else {
                history.push(`/todo`)
            }
        }
    }
    // Load data on start from database
    async function loadTodoData() {
        setLoading(true)
        try{
            const toDoData = await axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList.json?auth=${token}`);
            dispatch(toDoActions.setToDoList(toDoData.data));
        }
        catch(err){
            alert(err)
        }
        setLoading(false)
    }
    useEffect(()=>{
        if(toDoList[0].test) {
            loadTodoData();
        }
    },[])
    return (
        <section id="toDo">
            <div id='toDoControls'>
                <select onChange={setSortQuery} ref={sortRef} name="sort" className='hover button' id="sortTodo">
                    <option value="">Sort By</option>
                    <option value="dateAsc">Date Ascending</option>
                    <option value="dateDesc">Date Descending</option>
                    <option value="statusPend">Status Pending</option>
                    <option value="statusComp">Status Complete</option>
                </select>
                <input ref={searchRef} onChange={setSortQuery} type="text" id='searchTodo' className="focus" placeholder="Search" />
                <Link to="/add-new-todo" className='link' id="newTodoLink"><button className='hover button' id='newTodoBtn' >New To Do</button></Link>
            </div>
            {loading?<Loading id='loading'/>:<div id="toDoList">
                {sortedList.map((toDoItem,index)=>{
                    return (
                        <ToDoItem 
                        key={index} 
                        id={toDoItem.id}
                        title={toDoItem.title} 
                        description={toDoItem.description} 
                        creationDate={toDoItem.creationDate}
                        targetDate={toDoItem.targetDate}
                        status={toDoItem.status}
                        />
                    )
                })}
                <div className='hidden'>123</div>
                <div className='hidden'>123</div>
            </div>}
        </section>
    )
}

export default Todo
