import {useSelector} from 'react-redux';
import { useRef} from 'react';
import {Link,useHistory,useLocation} from 'react-router-dom';
import './Todo.scss';
import ToDoItem from './TodoItem';

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
        list = list.filter(item=>item.title.toLowerCase().includes(searchQuery))
    }
    return list
}

function Todo(props) {
    const [toDoList] = [useSelector(state=>state.toDoSlice.toDoList)];
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
                <input ref={searchRef} onChange={setSortQuery} type="text" id='searchTodo' />
                <Link to="/add-new-todo" className='link' id="newTodoLink"><button className='hover button' id='newTodoBtn' >Add New To Do</button></Link>
            </div>
            <div id="toDoList">
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
            </div>
        </section>
    )
}

export default Todo
