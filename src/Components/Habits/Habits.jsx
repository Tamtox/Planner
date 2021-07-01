import {useSelector,useDispatch} from 'react-redux';
import { useState,useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Habits.scss';
import Loading from '../Misc/Loading';
import AddNewHabitItem from './AddNewHabitItem';
import { habitsActions } from '../../Store/Store';

// Get dates of mon-sun of selected date's week
function getWeek(date) {
    let currentWeekday = date.getDay();
    if(currentWeekday === 0) currentWeekday = 7;
    const weekStartDate = new Date(date.getTime()-(86400000*(currentWeekday-1)));
    const weekEndDate = new Date(weekStartDate.getTime()+(86400000*6));
    return {weekStart:weekStartDate,weekEnd:weekEndDate}
}

function Habits(props) {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    // Toggle add new habit
    const [toggleNewHabit,setToggleNewHabit] = useState(false);
    const [weekStart,weekEnd] = [getWeek(new Date()).weekStart,getWeek(new Date()).weekEnd];
    const week = `${weekStart.toLocaleDateString().replaceAll('/',' ')}-${weekEnd.toLocaleDateString().replaceAll('/',' ')}`;
    const habits = useSelector(state=>state.habitsSlice.habits[week])
    // Load habits data
    async function loadHabitsData(date) {
        setLoading(true)
        // Check if current week exists in database
        axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/${week}.json?auth=${token}`)
        .then(res=>{
            const newWeekData = {};
            // Create new week entry if its null
            if(res.data === null) {
                // Load Habit List and set new weeks data
                axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/habitsList.json?auth=${token}`)
                .then(res=>{
                    // Dispatch habit list and assign new week data
                    const habits = res.data
                    dispatch(habitsActions.setHabitList(res.data))
                    for(let habit in habits) {
                        newWeekData[habit] = {
                            title:habits[habit].title,
                            weekdays:habits[habit].weekdays,
                            status:{'Mon':'Pending','Tue':'Pending','Wed':'Pending','Thu':'Pending','Fri':'Pending','Sat':'Pending','Sun':'Pending'},
                        }
                    }
                    newWeekData.weekStart=weekStart.toString();
                    newWeekData.weekEnd=weekEnd.toString();
                })
                // Put new week data in database
                .then(res=>{
                    dispatch(habitsActions.setHabitData({week:week,weekData:newWeekData}))
                    axios.request({
                    method: "put",
                    url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/${week}.json?auth=${token}`,
                    data: newWeekData,
                }).catch(err=>{
                    alert(err.response.data.error.message)
                })
                }).catch(err=>{
                    alert(err.response.data.error.message)
                })
            } 
            // Load this weeks data
            else {
                axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/${week}.json?auth=${token}`)
                .then(res=>{
                    console.log(res)
                    dispatch(habitsActions.setHabitData())
                }).catch(err=>{
                    alert(err.response.data.error.message)
                })
            }
        }).catch(err=>{
            alert(err.response.data.error.message)
        })
    }
    console.log(habits)
    return (
        <section id="habits">
            <div id="habitsControls">
                <div></div>
                <div id="week">{`${getWeek(new Date()).weekStart.toLocaleDateString()} - ${getWeek(new Date()).weekEnd.toLocaleDateString()}`}</div>
                <button id="addNewHabit" className='hover button' onClick={()=>setToggleNewHabit(!toggleNewHabit)}>New Habit</button>
            </div> 
            <div id="habitsList">
                <button onClick={()=>loadHabitsData(new Date())}>Load</button>
            </div> 
            {toggleNewHabit && <AddNewHabitItem token={token} userId={userId} week={week} returnToHabits={()=>setToggleNewHabit(!toggleNewHabit)} />}
        </section>
    )
}

export default Habits