import {useSelector,useDispatch} from 'react-redux';
import { useState,useEffect} from 'react';
import './Schedule.scss';
import AddNewScheduleItem from './AddNewScheduleItem';
import ScheduleItem from './ScheduleItem';
import axios from 'axios';
import Cookies from 'js-cookie';
import { scheduleActions } from "../../Store/Store";

// Sort and filter array based on time and active weekdays
function sortAndFilter(arr,weekday) {
    return arr.sort((item1,item2)=> {
        return +item1.time.replace(':','') - +item2.time.replace(':','')
    }).filter(item=>{
        if(item.weekdays[weekday] == true) {
            return item
        }
    })
}

function Schedule() {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const dispatch = useDispatch();
    const schedule = useSelector(state=>state.scheduleSlice.schedule);
    const [weekday,setWeekDay] = useState(new Date().getDay()+'')
    // Toggle Add new Schedule task form
    const [toggleAddNew, setToggleAddNew] = useState(false);
    // Fetch schedule data from server
    function fetchScheduleData() {
        axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/schedule.json?auth=${token}`)
        .then(res=>{
            dispatch(scheduleActions.setSchedule(res.data))
        }).catch(err=>{
            console.log(err)
        })
    }
    // Delete schedule task
    function deleteScheduleTask(taskname) {
        dispatch(scheduleActions.removeTask(taskname))
        axios.request({
            method: "delete",
            url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/schedule/${taskname.toLowerCase()}.json?auth=${token}`,
        }).catch(err=>{
            alert(err.response.data.error.message)
        })
    }
    // Sort tasks by time and filter by active weekdays
    const scheduleArr = sortAndFilter(Object.values(schedule),weekday);
    useEffect(() => {
        fetchScheduleData();
    }, [])
    return (
        <section id='schedule'>
            <div id='scheduleControls'>
                <select onChange={(event)=>setWeekDay(event.target.value+'')} id="selectDay" className='hover button' defaultValue={weekday}>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="0">Sunday</option>
                </select>
                <button onClick={()=>setToggleAddNew(!toggleAddNew)} id='addNewScheduleEntry' className='hover button'>Add New Entry</button>
            </div>
            <div id='scheduleTaskList'>
                {scheduleArr.map((item,index)=>{
                    return (
                        <ScheduleItem key={index} title={item.title} time={item.time} delete={()=>deleteScheduleTask(item.title)} />
                    )
                })}
            </div>
            {toggleAddNew && <AddNewScheduleItem token={token} userId={userId} returnToSchedule={()=>setToggleAddNew(false)}/>}
        </section>
    )
}

export default Schedule