import './ScheduleItem.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';

function ScheduleItem(props) {
    
    return (
        <div className='scheduleItem fade-in'>
            <p className='scheduleItemTitle'>{props.title}</p>
            <p className='scheduleItemTime'>{props.time}</p>
            <div className='deleteScheduleItem'>
                <FontAwesomeIcon  className='deleteScheduleItemIcon hoverFilter' icon={faTrashAlt} onClick={props.delete}/>
            </div>
        </div>
    )
}

export default ScheduleItem