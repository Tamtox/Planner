import {createSlice} from '@reduxjs/toolkit';
const initialToDoState = {
    toDoList:[{
        "creationDate": "Wed Jun 16 2021 11:01:40 GMT+0000 (Coordinated Universal Time)",
        "description": "Add your own tasks",
        "status": "Complete",
        "targetDate": "Wed Jun 16 2021 11:01:40 GMT+0000 (Coordinated Universal Time)",
        "title": "Welcome",
        "test":true
    }]
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
