import {createSlice} from '@reduxjs/toolkit';

const initialScheduleState = {
    "0":{},
    "1":{},
    "2":{},
    "3":{},
    "4":{},
    "5":{},
    "6":{}
}

const scheduleSlice = createSlice({
    name:'schedule',
    initialState:initialScheduleState,
    reducers:{
        addTask(state,action) {

        },
        removeTask(state,action) {
            
        }
        
    }
});

export default scheduleSlice