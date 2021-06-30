import {useSelector,useDispatch} from 'react-redux';
import { useState,useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import './Habits.scss';
import Loading from '../Misc/Loading';
import AddNewHabitItem from './AddNewHabitItem';

// Get dates of mon-sun of selected date's week
function getWeek(date) {
    let currentWeekday = date.getDay();
    if(currentWeekday === 0) currentWeekday = 7;
    const weekStartDate = new Date(date.getTime()-(86400000*(currentWeekday-1)));
    const weekEndDate = new Date(weekStartDate.getTime()+(86400000*6));
    return {weekStart:weekStartDate.toLocaleDateString(),weekEnd:weekEndDate.toLocaleDateString()}
}

function Habits(props) {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    // Select and load week range data
    const [startDate, setStartDate] = useState(new Date());
    // Toggle add new habit
    const [toggleNewHabit,setToggleNewHabit] = useState(false);
    // Load habits data
    function loadData(date) {

    }
    return (
        <section id="habits">
            <div id="habitsControls">
                <Flatpickr
                    id='datePicker' className='hover datePick'
                    options={{ minDate:new Date(),dateFormat:'d-m-Y'}}
                    value={startDate}
                    onChange={date => {setStartDate(date);}}
                />
                <div id="week">{`${getWeek(startDate).weekStart} - ${getWeek(startDate).weekEnd}`}</div>
                <button id="addNewHabit" className='hover button' onClick={()=>setToggleNewHabit(!toggleNewHabit)}>New Habit</button>
            </div> 
            <div id="habitsList">
                123
            </div> 
            {toggleNewHabit && <AddNewHabitItem token={token} userId={userId} returnToHabits={()=>setToggleNewHabit(false)} />}
        </section>
    )
}

export default Habits