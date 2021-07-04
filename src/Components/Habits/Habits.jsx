import {useSelector,useDispatch} from 'react-redux';
import { useState,useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Habits.scss';
import Loading from '../Misc/Loading';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import HabitItem from './HabitItem'; 
import AddNewHabitItem from './AddNewHabitItem';
import { habitsActions } from '../../Store/Store';

function Habits(props) {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const dispatch = useDispatch();
    const habitsArr = Object.values(useSelector(state=>state.habitsSlice.entry));
    const habitsList = Object.values(useSelector(state=>state.habitsSlice.habitsList));
    // States: date,toggle new habit, loader
    const [startDate, setStartDate] = useState(new Date());
    const [toggleNewHabit,setToggleNewHabit] = useState(false);
    const [loading,setLoading] = useState(false);
    const [isHabitsList,setIsHabitsList] = useState(false)
    // Load habits data
    function loadHabitsData(date) {
        setLoading(true)
        const [targetYear,targetMonth,targetDate,targetWeekday] = [date.getFullYear(),date.getMonth()+1,date.getDate(),date.getDay()];
        // Check if current week exists in database
        axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/${targetYear}/${targetMonth}/${targetDate}.json?auth=${token}`)
        .then(res=>{
            // Create new week entry if its null
            if(res.data === null) {
                const newDateData = {};
                // Get habit list 
                axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/habitsList.json?auth=${token}`)
                .then(res=>{
                    dispatch(habitsActions.setHabitList(res.data))
                    for(let habit in res.data) {
                        if(res.data[habit].weekdays[targetWeekday]) {
                            newDateData[habit] = {...res.data[habit],status:'Pending',date:new Date().toString()}   
                        }
                    }
                })
                // Put habits data to selected date 
                .then(res=>{
                    dispatch(habitsActions.setHabitData(newDateData))
                    axios.request({
                        method: "put",
                        url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/${targetYear}/${targetMonth}/${targetDate}.json?auth=${token}`,
                        data: newDateData,
                    }).catch(err=>{
                        alert(err.response.data.error.message)
                    })
                })
            } else {
                axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/habitsList.json?auth=${token}`)
                .then(res=>{
                    dispatch(habitsActions.setHabitList(res.data))
                })
                dispatch(habitsActions.setHabitData(res.data))
            }
            setLoading(false)
        }).catch(err=>{
            alert(err)
        })
    }
    // Load selected date's data
    function loadSelectedData(date) {
        setStartDate(date)
        loadHabitsData(date[0])
    }
    // Delete habit
    function deleteHabit(habitName) {
        dispatch(habitsActions.deleteHabit(habitName.toLowerCase()))
        axios.request({
            method: "delete",
            url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/habitsList/${habitName.toLowerCase()}.json?auth=${token}`,
        }).catch(err=>{
            alert(err.response.data.error.message)
        })
    }
    // Change habit status
    function changeHabitStatus(date,habitName,status) {
        const [targetYear,targetMonth,targetDate] = [date.getFullYear(),date.getMonth()+1,date.getDate()];
        dispatch(habitsActions.changeHabitStatus(habitName.toLowerCase()))
        axios.request({
            method: "patch",
            url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/habits/${targetYear}/${targetMonth}/${targetDate}/${habitName.toLowerCase()}.json?auth=${token}`,
            data: status === 'Pending'?{'status':'Complete'}:{'status':'Pending'},
        }).catch(err=>{
            alert(err.response.data.error.message)
        })
    }
    useEffect(() => {
        if(habitsArr[0].test) {
            loadHabitsData(new Date())
        }
    }, [])
    return (
        <section id="habits">
            <div id="habitsControls">
                <Flatpickr 
                    id="habitsDateSelection" className="hover datePick" 
                    options={{dateFormat:'d-m-Y ',enableTime:false,minDate:new Date()}}  
                    value={startDate} onChange={date => {loadSelectedData(date)}}
                />
                <button id='habitsViewToggle' className='hover button' onClick={()=>setIsHabitsList(!isHabitsList)}>
                    {isHabitsList?'Habits List':"Today's Habits"}
                </button>
                <button id="addNewHabit" className='hover button' onClick={()=>setToggleNewHabit(!toggleNewHabit)}>New Habit</button>
            </div>
            {loading?<Loading id='loading'/>:
            !isHabitsList?
            <div id="todaysHabits">
                {habitsArr.map((item,index)=>{
                    return <HabitItem key={index} title={item.title} status={item.status} changeStatus={()=>changeHabitStatus(startDate,item.title,item.status)} />
                })}
            </div>
            :
            <div id='habitsList'>
                {habitsList.map((item,index)=>{
                    let activeWeekdays = `${item.weekdays[1]?'Mon,':''}${item.weekdays[2]?'Tue,':''}${item.weekdays[3]?'Wed,':''}${item.weekdays[4]?'Thu,':''}${item.weekdays[5]?'Fri,':''}${item.weekdays[6]?'Sat,':''}${item.weekdays[0]?'Sun,':''}`;
                    return <HabitItem key={index} title={item.title} weekdays={activeWeekdays} deleteHabit={()=>deleteHabit(item.title)} />
                })}
            </div>
            } 
            {toggleNewHabit && <AddNewHabitItem token={token} userId={userId} startDate={startDate} returnToHabits={()=>setToggleNewHabit(!toggleNewHabit)} />}
        </section>
    )
}

export default Habits