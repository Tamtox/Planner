import React from 'react';
import './HabitItem.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt,faCircle,faCheckCircle} from '@fortawesome/free-regular-svg-icons';


function HabitItem(props) {
    return (
        <React.Fragment>
            {props.weekdays === undefined?
            <div className='habitItem fade-in'>
                <p className='habitItemTitle'>{props.title}</p>
                {props.status === 'Pending'?<FontAwesomeIcon  className='habitPendingIcon hoverFilter' icon={faCircle} onClick={props.changeStatus}/>:<FontAwesomeIcon  className='habitCompleteIcon hoverFilter' icon={faCheckCircle} onClick={props.changeStatus}/>}
            </div>:
            <div className='habitListItem fade-in'>
                <p className='habitListItemTitle'>{props.title}</p>
                <p className='habitListActiveWeekdays'>{props.weekdays[props.weekdays.length-1]===','?props.weekdays.slice(0,-1):props.weekdays}</p>
                <FontAwesomeIcon  className='deleteHabitIcon hoverFilter' icon={faTrashAlt} onClick={props.deleteHabit}/>
            </div>
            }
        </React.Fragment>
    )
}

export default HabitItem