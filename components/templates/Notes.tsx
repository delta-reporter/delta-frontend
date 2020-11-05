import { useState, useEffect } from 'react';
import { Button, FormControl, makeStyles, TextField, Paper } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  addNoteButton: {
      width: "90px",
      height: "30px",
      border: "1px #a7bab1 solid",
      fontSize: "12px",
  }
}))

interface NotesProps {
    mother_test_id: number
    darkMode: boolean
    message?: any
}

export const Notes = function(props: NotesProps) {
    
    const classes = useStyles(props)
    const { mother_test_id, message} = props;
    const [notes, setNotes] = useState(message || []);

    const loading = !notes
    const noData = notes.message // if there are no notes, we get {"message": "No notes were found"}

    const getData = async () => {
      const response = await fetch(`${process.env.publicDeltaCore}/api/v1/notes/${mother_test_id}`);
      const data = await response.json();
      setNotes(data);
    };

    useEffect(() => {
      getData();
    }, [])

    const getNotes = async (mother_test_id: number) => {
      //GET existing notes for test with id
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      };
      const getNotesResponse = await fetch(
        `${process.env.publicDeltaCore}/api/v1/notes/${mother_test_id}`,
        options
      );
      return await getNotesResponse.json();
    }

    const addNote = async (noteText, addedBy) => {
      // POST request to add a new note
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mother_test_id: mother_test_id,
          note_text: noteText,
          added_by: addedBy
        }),
      }
      const postResponse = await fetch(
        `${process.env.publicDeltaCore}/api/v1/notes`,
        options
      )
      await postResponse.json()
      const res = await getNotes(mother_test_id);

      (document.getElementById("noteText") as HTMLInputElement).value = '';
      (document.getElementById("noteAddedBy") as HTMLInputElement).value = '';
      setNotes(res);
    }

    const submit = () => {
      addNote((document.getElementById("noteText") as HTMLInputElement).value, 
          (document.getElementById("noteAddedBy") as HTMLInputElement).value)
    }

    return (
      <>
        <div style={{overflow:"auto", paddingTop: "23px", paddingLeft:"40px", maxHeight: 430, marginLeft:"-40px"}}>
          <FormControl style={{display: "block"}}>
            <Paper elevation={3} style={{color:"#000", background:"#ffc", display:"block", height: "12em",  marginLeft:"1em", marginTop: "5px", float:"left", width:"12em", padding: "5px", marginBottom:"2px"}} square={true}>
              <TextField id="noteText" type="text" placeholder="New note" autoFocus style={{justifyContent:"center", alignItems:"center", display:"flex", padding: "5px"}}/>
              <TextField id="noteAddedBy"  type="text" placeholder="Your name" style={{justifyContent:"center", alignItems:"center", display:"flex", padding: "15px 5px 15px 5px"}}/>
              <Button id="submit" onClick={() => submit()} className={classes.addNoteButton} style={{margin:"10px 30px 10px"}}>Add note</Button>
            </Paper>
          </FormControl>
          {loading || noData ?
            <p style={{paddingTop: "30px", paddingLeft:"240px"}}>There are no notes for this test. Feel free to add one :) </p>
                : (
                    notes.reverse().map(note => (
                      <Paper elevation={3} style={{color:"#000", background:"#ffc", display:"block", height: "12em",  marginLeft:"1em", marginTop: "5px", float:"left", width:"12em", padding: "5px"}} square={true}>
                        <p style={{fontFamily:"Kalam", fontStyle:"italic", fontSize:"1.25em", justifyContent:"center", alignItems:"center", display:"flex", wordBreak:"break-word"}}>{note.note_text}</p>
                        <p style={{ fontStyle:"italic",  fontSize:"0.9em", color:"#8b8888"}}>{note.added_by}</p>
                        <p style={{ fontStyle:"italic",  fontSize:"0.8em", color:"#8b8888"}}>{note.created_datetime.substring(0, note.created_datetime.length - 7)}</p>
                      </Paper>
                      ))
                
                  )
          } 
        </div>
      </>
    )
}
