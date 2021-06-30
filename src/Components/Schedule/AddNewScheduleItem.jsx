import axios from 'axios';
import {useDispatch} from 'react-redux';
import { useRef,useState } from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import './AddNewScheduleItem.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { scheduleActions } from "../../Store/Store";

function AddNewScheduleItem(props) {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(new Date());
    // Set Active weekdays
    const [checkBoxes,setCheckboxes] = useState({1:false,2:false,3:false,4:false,5:false,6:false,0:false});
    function setWeekdays(event) {
        setCheckboxes({...checkBoxes,[event.target.name]:!checkBoxes[event.target.name]});
    }
    // Add new task to schedule
    const taskNameRef = useRef();
    function addNewScheduleEntry(event) {
        event.preventDefault();
        const [taskNameInput,timeInput] = [taskNameRef.current.value,startDate[0].toLocaleTimeString().slice(0,-3)];
        let activeDays = Object.values(checkBoxes).every(item=>item===false)?{1:true,2:true,3:true,4:true,5:true,6:true,0:true}:checkBoxes;
        const newScheduleTask = {weekdays:activeDays,time:timeInput,title:taskNameInput}
        dispatch(scheduleActions.addTask(newScheduleTask))
        axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/schedule/${taskNameInput.toLowerCase()}.json?auth=${props.token}`)
        .then(res=>{
            // Put new entry if one doesn't exist
            if(res.data === null) {
                axios.request({
                    method: "put",
                    url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/schedule/${taskNameInput.toLowerCase()}.json?auth=${props.token}`,
                    data: newScheduleTask,
                }).catch(err=>{
                    alert(err.response.data.error.message)
                })
            } 
            // Patch existing entry
            else {
                axios.request({
                    method: "patch",
                    url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/schedule/${taskNameInput.toLowerCase()}.json?auth=${props.token}`,
                    data: newScheduleTask,
                }).catch(err=>{
                    alert(err.response.data.error.message)
                })
            }
        }).catch(err=>{
            alert(err.response.data.error.message)
        })
        props.returnToSchedule();
    }
    return (
        <div id='addScheduleItemBackdrop'>
            <form id='addScheduleItemForm' onSubmit={addNewScheduleEntry}>
                <div className='infoTooltip'>
                    <span className='infoTooltipText'>Select active weekdays. Leave unchecked to apply task to every day. </span>
                    <FontAwesomeIcon className='hoverFilter infoIcon' icon={faInfoCircle} />
                </div>
                <Flatpickr
                    id='newScheduleTaskTime' className="hover datePick"
                    options={{ dateFormat:' H:i',enableTime:true,time_24hr:true,noCalendar:true }}
                    value={startDate}
                    onChange={date => {setStartDate(date);}}
                />
                <input type="text" ref={taskNameRef} id='newScheduleTaskName' className="focus" placeholder='Task Name' required/>
                <div className="weekDaysSelector">
                    <input type="checkbox" id="weekday-mon" name="1" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-mon">Mon</label>
                    <input type="checkbox" id="weekday-tue" name="2" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-tue">Tue</label>
                    <input type="checkbox" id="weekday-wed" name="3" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-wed">Wed</label>
                    <input type="checkbox" id="weekday-thu" name="4" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-thu">Thu</label>
                    <input type="checkbox" id="weekday-fri" name="5" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-fri">Fri</label>
                    <input type="checkbox" id="weekday-sat" name="6" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-sat">Sat</label>
                    <input type="checkbox" id="weekday-sun" name="0" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-sun">Sun</label>
                </div>
                <div id="addScheduleFormButtons">
                    <button id="returnToSchedule" className='button hover' onClick={props.returnToSchedule}>Go Back</button>
                    <button id="submitScheduleTask" className='button hover' >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddNewScheduleItem