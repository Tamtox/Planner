import {createSlice} from '@reduxjs/toolkit';
const initialToDoState = {
    toDoList:[]
}
const toDoSlice = createSlice({
    name:'toDo',
    initialState:initialToDoState,
    reducers:{
        addToDo(state,action) {
            state.toDoList.push(action.payload)
        },
        removeToDo(state,action) {
            state.toDoList = state.toDoList.filter(item=>{
                return item.id !== action.payload
            })
        },
        changeToDoStatus(state,action) {
            state.toDoList = state.toDoList.map(item=>{
                if(item.id === action.payload) {
                    item.status = item.status === 'Pending'?'Complete':'Pending'
                }
                return item
            })
        },
        setToDoList(state,action) {
            const toDoList = [];
            for(let key in action.payload) {
                toDoList.push({id:key,...action.payload[key]})
            }
            state.toDoList = toDoList
        },
        editToDo(state,action) {
            state.toDoList = state.toDoList.map(item=>{
                if(item.id === action.payload.id) {
                    item = action.payload
                }
                return item
            })
        }
    }
});

export default toDoSlice
