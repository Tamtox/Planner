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
    const [checkBoxes,setCheckboxes] = useState({1:false,2:false,3:false,4:false,5:false,6:false,0:false});
    function setWeekdays(event) {
        setCheckboxes({...checkBoxes,[event.target.name]:!checkBoxes[event.target.name]});
    }
    const habitNameRef = useRef();
    // Add New Habit
    function addNewHabit(event) {
        event.preventDefault();
        const habitName = habitNameRef.current.value;
        const [targetYear,targetMonth,targetDate,targetWeekday] = [props.startDate.getFullYear(),props.startDate.getMonth()+1,props.startDate.getDate(),props.startDate.getDay()];
        let activeDays = Object.values(checkBoxes).every(item=>item===false)?{1:true,2:true,3:true,4:true,5:true,6:true,0:true}:checkBoxes;
        // Check if habit exists
        const newHabit = {title:habitName,weekdays:activeDays}
        axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/habits/habitsList/${habitName.toLowerCase()}.json?auth=${props.token}`)
        .then(res=>{
            // Create new habit if it doesn't exit
            if(res.data === null) {
                axios.request({
                    method: "put",
                    url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/habits/habitsList/${habitName.toLowerCase()}.json?auth=${props.token}`,
                    data: newHabit,
                }).catch(err=>{
                    alert(err.response.data.error.message)
                })
                // Add new habit for today 
                newHabit.status = 'Pending'
                newHabit.date = new Date().toString()
                if(activeDays[targetWeekday]) {
                    dispatch(habitsActions.addHabit(newHabit))
                    axios.request({
                        method: "put",
                        url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${props.userId}/appData/habits/${targetYear}/${targetMonth}/${targetDate}/${habitName.toLowerCase()}.json?auth=${props.token}`,
                        data: newHabit,
                    }).catch(err=>{
                        alert(err.response.data.error.message)
                    })
                }
            } else {
                alert('Habit already exists')
                return
            }
        }).catch(err=>{
            alert(err)
        })
        props.returnToHabits();
    }
    return (
        <div id='addHabitItemBackdrop' className='opacity-transition'>
            <form id='addHabitItemForm' onSubmit={addNewHabit} className='scale-in'>
                <div className="infoTooltip">
                    <span className="infoTooltipText">Select active weekdays. Leave unchecked to apply task to every day. </span>
                    <FontAwesomeIcon className='hoverFilter infoIcon' icon={faInfoCircle} />
                </div>
                <input type="text" ref={habitNameRef} id='newHabitName' className="focus" placeholder='Habit Name' required/>
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
                <div id="addHabitFormButtons">
                    <button id="returnToHabits" className='button hover' onClick={props.returnToHabits}>Go Back</button>
                    <button id="submitHabit" className='button hover' >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddNewHabitItem