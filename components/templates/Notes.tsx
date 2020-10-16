import { useState, useEffect } from 'react';
import produce from 'immer';
import { Button, Input } from '@material-ui/core';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json())

interface NotesProps {
    mother_test_id: number
    darkMode: boolean
}

export const Notes = function(props: NotesProps) {
    const { mother_test_id, darkMode} = props;
    const initialData = [{ text: 'Loading Notes ... ' }];
    const [data, setData] = useState(initialData);
    const { data, error } = useSWR(
      `${process.env.publicDeltaCore}/api/v1/notes/${mother_test_id}`,
      fetcher
    )
    const [notes, setNotes] = useState(data);

    const loading = !notes && !error
    const noData = !data

    const addNote = async (noteText) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mother_test_id: mother_test_id,
          note_text: noteText,
          added_by: "Johnny Cristian"
        }),
      }
      console.log(requestOptions)
  
      const response = await fetch(
        `${process.env.publicDeltaCore}/api/v1/notes`,
        requestOptions
      )
      await response.json()

      const requestOptions2 = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
  
      const response2 = await fetch(
        `${process.env.publicDeltaCore}/api/v1/notes/${mother_test_id}`,
        requestOptions2
      )
      const res = await response2.json()

      setNotes(res)
    }

    function getBackgroundColor(darkMode) {
        if(darkMode) return "#2a2a2a"
        else return "white"
    }
    
    function getTextColor(darkMode) {
        if(darkMode) return "#8c8d8d"
        else return "black"
    }

    // const addNote = async (noteText) => {
    //     const requestOptions = {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         test_id: testId,
    //         test_resolution: resolutionValue,
    //         mother_test_id: motherTestId
    //       }),
    //     }
    //     console.log(requestOptions)
    
    //     const response = await fetch(
    //       `${process.env.publicDeltaCore}/api/v1/test_history_resolution`,
    //       requestOptions
    //     )
    //     await response.json()
    //   }
  
    // const handleClick = () => {
    //   const text = document.querySelector('#noteinput').value.trim();
    //   if (text) {
    //     const nextState = produce(notes, draftState => {
    //       draftState.push({ text });
    //     });
    //     document.querySelector('#noteinput').value = '';
  
    //     if (typeof window !== 'undefined') {
    //       localStorage.setItem('data', JSON.stringify(nextState));
    //     }
  
    //     setNotes(nextState);
    //   }
    // };
  
    // useEffect(() => {
    //   if (typeof window !== 'undefined') {
    //     const getData = localStorage.getItem('data');
  
    //     if (getData !== '' && getData !== null) {
    //       return setNotes(JSON.parse(getData));
    //     }
    //     return setNotes([]);
    //   }
    // }, 0);
  
    if(noData) {
      return (
        <>
        <p>No data</p>
        </>
      )
    } else {
      return (
        <>
          <Input id="noteinput" style={{ width: '80%' }} type="text" placeholder="Enter a new note" />
          <Button onClick={() => addNote((document.getElementById("noteinput") as HTMLInputElement).value)}>Add note</Button>
          {loading
            ? "Loading notes..."
            : notes.map(note => (
              <>
              <div>{note.note_text}</div>
              <div>{note.added_by}</div>
              <div>{note.created_datetime}</div>
              </>
              ))
            }
        </>
      );
    }

}
