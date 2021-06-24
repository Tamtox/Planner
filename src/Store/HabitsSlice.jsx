import {createSlice} from '@reduxjs/toolkit';
const initialHabitsState = {};
const habitsSlice = createSlice({
    name:'habits',
    initialState:initialHabitsState,
    reducers:{
        addToDo(state,action) {
            state.toDoList.push(action.payload)
        },
        removeToDo(state,action) {
            
        }
    }
});

export default habitsSlice