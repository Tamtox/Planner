import {createSlice} from '@reduxjs/toolkit';

const initialScheduleState = {
    schedule:{
        'start using planner':{
            'title':'Start using Planner',
            'weekdays':{1:true,2:true,3:true,4:true,5:true,6:true,0:true},
            'time':'12:00'
        }
    }
}

const scheduleSlice = createSlice({
    name:'schedule',
    initialState:initialScheduleState,
    reducers:{
        addTask(state,action) {
            state.schedule[action.payload.title.toLowerCase()] = {'title':action.payload.title, 'weekdays':action.payload.weekdays,'time':action.payload.time}
        },
        removeTask(state,action) {
            const newSchedule = {...state.schedule};
            delete newSchedule[action.payload.toLowerCase()]
            state.schedule = newSchedule
        },
        setSchedule(state,action) {
            state.schedule = action.payload
        }
    }
});

export default scheduleSlice