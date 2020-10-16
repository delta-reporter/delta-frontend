import { useState, useEffect } from 'react';
import { Button, Input } from '@material-ui/core';


interface NotesProps {
    mother_test_id: number
    darkMode: boolean
}

export const Notes = function(props: NotesProps) {
    const { mother_test_id, darkMode} = props;
    const [notes, setNotes] = useState([]);

    const loading = !notes
    const noData = notes.message // if there are no notes, we get {"message": "No notes were found"}

    useEffect(() => {
      const getData = async () => {
        const response = await fetch(`${process.env.publicDeltaCore}/api/v1/notes/${mother_test_id}`);
        const data = await response.json();
        setNotes(data);
      };
      getData();
    }, [])

    const addNote = async (noteText) => {
      // POST request to add a new note
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
      
      //GET request to refresh the list of all notes
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

    // function getBackgroundColor(darkMode) {
    //     if(darkMode) return "#2a2a2a"
    //     else return "white"
    // }
    
    // function getTextColor(darkMode) {
    //     if(darkMode) return "#8c8d8d"
    //     else return "black"
    // }
  
    return (
      <>
          <Input id="noteinput" style={{ width: '80%' }} type="text" placeholder="Enter a new note" />
          <Button onClick={() => addNote((document.getElementById("noteinput") as HTMLInputElement).value)}>Add note</Button>
          {loading || noData ?
           <p>There are no notes for this test. Feel free to add one :) </p>
          : (
            notes.map(note => (
              <>
              <div>{note.note_text}</div>
              <div>{note.added_by}</div>
              <div>{note.created_datetime}</div>
              </>
              ))
          )} 
      </>
    )
}
