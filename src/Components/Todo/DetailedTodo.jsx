import {useSelector,useDispatch} from 'react-redux';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import {Fragment,useRef,useState} from 'react';
import { Prompt } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toDoActions } from '../../Store/Store';
import './DetailedTodo.scss';

function DetailedTodo(props) {
    const filteredArr = useSelector(state=>state.toDoSlice.toDoList).filter(item=>item.id === props.paramId);
    const detailedItem = filteredArr[0]
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const dispatch = useDispatch();
    const [titleRef,descriptionRef] = [useRef(),useRef()];
    // Date Pick 
    const [datePickerUsed,setDatePickerUsed] = useState(false);
    const [startDate, setStartDate] = useState(detailedItem.targetDate!==undefined?new Date(detailedItem.targetDate):new Date());
    function datePick(date) {
        setStartDate(date);
        setDatePickerUsed(true)
    }
    // Edit Todo 
    async function editTodo(event) {
        event.preventDefault();
        const [titleInput,descriptionInput] = [titleRef.current.value,descriptionRef.current.value];
        const editedTodo = {
            title:titleInput,
            description:descriptionInput,
            creationDate:detailedItem.creationDate,
            status:detailedItem.status,
        }
        if(detailedItem.targetDate !== undefined) {
            editedTodo.targetDate = startDate.toString();
        } else {
            if(datePickerUsed) {
                editedTodo.targetDate = startDate.toString();
            }
        }
        await dispatch(toDoActions.editToDo({...editedTodo,id:props.paramId}));
        axios.request({
            method: "patch",
            url:`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList/${props.paramId}.json?auth=${token}`,
            data:editedTodo
        }).then(res=>{
            // Fetech data for relevant id
            axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList.json?auth=${token}`)
            .then(res=>{
            dispatch(toDoActions.setToDoList(res.data));
            }).catch(err=>{
            alert(err)
            })
        }).catch(err=>{
            alert(err)
        })
        // Return to todo page
        props.redirectOnTodoSubmit()
    } 
    // Promt on form focus
    const [used,setUsed] = useState(false);
    function finishEntering() {
        setUsed(false)
    }
    function formFocus() {
        setUsed(true)
    }
    return(
        <Fragment>
            <Prompt when={used} message={()=> "All entered data will be lost!"} />
            <section id='detailedTodo'>
                <form action="" id="detailedToDoForm" onSubmit={editTodo} onFocus={formFocus}>
                    <div id='detailedDates'>
                        <Flatpickr
                            id='datePicker'
                            options={{ minDate:new Date(),dateFormat:'d-m-Y  H:i',enableTime:true,time_24hr:true }}
                            value={startDate}
                            onChange={date => {datePick(date);}}
                        />
                    </div>
                    <input ref={titleRef} type="text" id="detailedTitle" placeholder='Title' defaultValue={detailedItem!==undefined?detailedItem.title:''} required />
                    <textarea ref={descriptionRef}  placeholder="Description(optional)" id="detailedDescription" cols="1" rows="1" defaultValue={detailedItem!== undefined?detailedItem.description:''}></textarea>
                    <button id="submitButton" className='hover button' onClick={finishEntering}>Submit</button>
                    <p id='creationDate'>{`Created: ${detailedItem!==undefined?new Date(detailedItem.creationDate).toLocaleString():''}`}</p>
                </form>
            </section>
        </Fragment>
    )
}

export default DetailedTodo