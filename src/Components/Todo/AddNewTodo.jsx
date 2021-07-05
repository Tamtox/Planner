import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import {useDispatch} from 'react-redux';
import {Fragment,useRef,useState} from 'react';
import { Prompt } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import {toDoActions} from '../../Store/Store';
import './AddNewTodo.scss';

function AddNewTodo(props) {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const dispatch = useDispatch();
    const newTodoRef = useRef();
    // Date Pick 
    const [datePickerUsed,setDatePickerUsed] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    function datePick(date) {
        setStartDate(date);
        setDatePickerUsed(true)
    }
    // Submit New Todo
    function submitForm(e) {
        e.preventDefault();
        let [newTodoTitle,newTodoDescription] = [e.target.children[1].value,e.target.children[2].value];
        const newTodo = {
            title:newTodoTitle,
            description:newTodoDescription,
            creationDate:new Date().toString(),
            status:'Pending'
        }
        if(datePickerUsed) {
            newTodo.targetDate = startDate.toString();
        }
        dispatch(toDoActions.addToDo(newTodo))
        axios.request({
            method: "post",
            url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList.json?auth=${token}`,
            data: newTodo,
        }).then(res=>{
            // Fetech relevant data
            axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList.json?auth=${token}`)
            .then(res=>{
            dispatch(toDoActions.setToDoList(res.data));
            }).catch(err=>{
            alert(err)
            })
        }).catch(err=>{
            alert(err.response.data.error.message)
        })
        // Return to Todo list 
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
            <section id="addNewTodo">
                <div id='addNewTodoCard' className='scale-in'>
                    <form ref={newTodoRef} id="addNewToDoForm" onSubmit={submitForm} onFocus={formFocus} >
                        <Flatpickr
                            id='newTodoDate' className="hover datePick"
                            options={{ minDate:new Date(),dateFormat:'d-m-Y  H:i',enableTime:true,time_24hr:true, }}
                            value={startDate}
                            onChange={date => {datePick(date);}}
                        />
                        <input type="text" id="newTodoTitle" className="focus" placeholder='Title' required />
                        <textarea placeholder="Description(optional)" id="newTodoDescription" className="focus" cols="1" rows="1"></textarea>
                        <button id="submitButton" className='hover button' onClick={finishEntering}>Submit</button>
                    </form>
                </div>
            </section>
        </Fragment>
    )
}

export default AddNewTodo
