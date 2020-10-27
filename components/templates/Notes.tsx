import { useState, useEffect } from 'react';
import { Button, FormControl, List, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  addNoteButton: {
      backgroundColor: theme.palette.primary.main,
      width: "90px",
      height: "30px",
      marginTop: "5px",
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
      <FormControl style={{display: "flex"}}>
          <TextField id="noteText" type="text" placeholder="Enter a new note" multiline autoFocus required/>
          <TextField id="noteAddedBy"  type="text" placeholder="Enter your name"/>
      </FormControl>
      <Button id="submit" onClick={() => submit()} className={classes.addNoteButton}>Add note</Button>
      <List style={{maxHeight: 200, overflow: 'auto'}}>
        {loading || noData ?
          <p>There are no notes for this test. Feel free to add one :) </p>
            : (
            notes.reverse().map(note => (
              <>
              <div>{note.note_text}</div>
              <div style={{display: 'flex', color: 'grey'}}>
                <div style={{paddingRight: '5px'}}>{note.added_by}</div>
                <div>{note.created_datetime}</div>
              </div>
              </>
              ))
          )} 
          </List>
      </>
    )
}
