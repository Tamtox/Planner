import {useSelector} from 'react-redux';
import { useRef} from 'react';
import {Link,useHistory,useLocation} from 'react-router-dom';
import './Schedule.scss'
import useRedirectOnSessionEnd from '../../CustomHooks/useRedirectOnSessionEnd'
function Schedule() {
    useRedirectOnSessionEnd();
    const weekdayRef = useRef();
    const date = new Date();
    function addNewScheduleEntry() {
        
    }
    return (
        <section id='schedule'>
            <div id='daySelectContainer'>
                <select ref={weekdayRef} id="selectDay" className='hover button' defaultValue={date.getDay()+''}>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="0">Sunday</option>
                </select>
                <button id='addNewScheduleEntry' className='hover button'>Add New Entry</button>
            </div>
            <div id='scheduleContainer'>
            </div>
        </section>
    )
}

export default Schedule