import {useDispatch} from 'react-redux';
import { Prompt } from 'react-router';
import React,{useState,useEffect,useRef} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import {journalActions} from '../../Store/Store';
import './Journal.scss';

function Journal(props) {
    const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
    const journalRef = useRef();
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(new Date());
    // Load journal entry from database if it exists
    function loadJournalData(date) {
        const [currentYear,currentMonth,currentDate] = [date.getFullYear(),date.getMonth()+1,date.getDate()];
        axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/journal/${currentYear}/${currentMonth}/${currentDate}.json?auth=${token}`)
        .then(res=>{
            // Put dummy data if entry is undefined
            if(res.data === null) {
                dispatch(journalActions.setEntry({date:date.toString(),entry:''}))
                axios.request({
                    method:'put',
                    url:`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/journal/${currentYear}/${currentMonth}/${currentDate}.json?auth=${token}`,
                    data:{date:date.toString(),entry:''}
                }).catch(err=>{
                    alert(err)
                })
                journalRef.current.value = ''
            } 
            // Assign redux state if data is there
            else{
                dispatch(journalActions.setEntry(res.data));
                journalRef.current.value = res.data.entry
            }
        }).catch(err=>{
        alert(err)
        })
    }
    // Select Journal Entry of different Date
    function selectJournalEntryByDate(newDate) {
        setStartDate(newDate);
        loadJournalData(newDate);
    }
    // Submit new journal entry
    function submitJournalForm(event) {
        event.preventDefault();
        let journalEntryInput = journalRef.current.value
        const [currentYear,currentMonth,currentDate] = [startDate.getFullYear(),startDate.getMonth()+1,startDate.getDate()];
        axios.request({
            method: "patch",
            url:`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/journal//${currentYear}/${currentMonth}/${currentDate}.json?auth=${token}`,
            data:{'entry':journalEntryInput}
        }).then(res=>{
            dispatch(journalActions.setEntry(res.data)) 
        }).catch(err=>{
            alert(err)
        })
    }
     // Promt on form focus
    const [used,setUsed] = useState(false);
    function finishEntering() {
        setUsed(false)
    }
    function formFocus() {
        setUsed(true)
    }
    useEffect(()=>{
        loadJournalData(new Date())
    },[])
    return (
        <section id="journal">
            <div id="journalCard">
                <Prompt when={used} message={()=> "All entered data will be lost!"} />
                <div id="dateSelection">
                    <Flatpickr id='datePicker' options={{ dateFormat:'d-m-Y ',enableTime:false }} value={startDate} onChange={date => {selectJournalEntryByDate(date[0]);}}/>
                </div>
                <form id="journalForm" onSubmit={submitJournalForm} onFocus={formFocus}>
                    <textarea ref={journalRef} id="journalEntry" cols="1" rows="1" required ></textarea>
                    <button id='submitJournalForm' className='button hover' onClick={finishEntering}>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default Journal
