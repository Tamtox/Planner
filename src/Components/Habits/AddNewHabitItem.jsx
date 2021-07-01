import axios from 'axios';
import {useDispatch} from 'react-redux';
import { useRef,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { habitsActions } from '../../Store/Store';
import './AddNewHabitItem.scss'

function AddNewHabitItem(props) {
    const dispatch = useDispatch();
    // Set Active weekdays
    const [checkBoxes,setCheckboxes] = useState({'Mon':false,'Tue':false,'Wed':false,'Thu':false,'Fri':false,'Sat':false,'Sun':false});
    function setWeekdays(event) {
        setCheckboxes({...checkBoxes,[event.target.name]:!checkBoxes[event.target.name]});
    }
    const habitNameRef = useRef();
    // Add New Habit
    function addNewHabit(event) {
        event.preventDefault();
        const habitName = habitNameRef.current.value;
        let activeDays = Object.values(checkBoxes).every(item=>item===false)?{'Mon':true,'Tue':true,'Wed':true,'Thu':true,'Fri':true,'Sat':true,'Sun':true}:checkBoxes;
        const newHabit = {title:habitName,weekdays:activeDays}
        axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/habits/habitsList/${habitName.toLowerCase()}.json?auth=${props.token}`)
        .then(res=>{
            // Put new entry if one doesn't exist
            if(res.data === null) {
                // Add new habit to habits list 
                axios.request({
                    method: "put",
                    url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/habits/habitsList/${habitName.toLowerCase()}.json?auth=${props.token}`,
                    data: newHabit,
                }).catch(err=>{
                    alert(err)
                })
                // Dispatch habit to redux
                newHabit.status = {'Mon':'Pending','Tue':'Pending','Wed':'Pending','Thu':'Pending','Fri':'Pending','Sat':'Pending','Sun':'Pending'}
                newHabit.week = props.week
                console.log(newHabit)
                dispatch(habitsActions.addHabit(newHabit))
                // Add habit to week
                axios.request({
                    method: "put",
                    url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/habits/${props.week}/${habitName.toLowerCase()}.json?auth=${props.token}`,
                    data: newHabit,
                }).catch(err=>{
                    alert(err)
                })

            } else {
                alert('Habit exists already')
                return
            }
        }).catch(err=>{
            alert(err)
        })
        props.returnToHabits();
    }
    return (
        <div id='addHabitItemBackdrop'>
            <form id='addHabitItemForm' onSubmit={addNewHabit}>
                <div className="infoTooltip">
                    <span className="infoTooltipText">Select active weekdays. Leave unchecked to apply task to every day. </span>
                    <FontAwesomeIcon className='hoverFilter infoIcon' icon={faInfoCircle} />
                </div>
                <input type="text" ref={habitNameRef} id='newHabitName' className="focus" placeholder='Habit Name' required/>
                <div className="weekDaysSelector">
                    <input type="checkbox" id="weekday-mon" name="Mon" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-mon">Mon</label>
                    <input type="checkbox" id="weekday-tue" name="Tue" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-tue">Tue</label>
                    <input type="checkbox" id="weekday-wed" name="Wed" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-wed">Wed</label>
                    <input type="checkbox" id="weekday-thu" name="Thu" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-thu">Thu</label>
                    <input type="checkbox" id="weekday-fri" name="Fri" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-fri">Fri</label>
                    <input type="checkbox" id="weekday-sat" name="Sat" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-sat">Sat</label>
                    <input type="checkbox" id="weekday-sun" name="Sun" className="weekday" onClick={(event)=>setWeekdays(event)}/>
                    <label htmlFor="weekday-sun">Sun</label>
                </div>
                <div id="addHabitFormButtons">
                    <button id="returnToHabits" className='button hover' onClick={props.returnToHabits}>Go Back</button>
                    <button id="submitHabit" className='button hover' >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddNewHabitItem