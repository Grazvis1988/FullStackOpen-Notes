import React, { useState, useEffect } from 'react'
import Note from './Note'
import noteService from '../services/notes'
import Notification from './Notification'

const Footer = () => {
	const footerStyle = {
		color: 'green',
		fontStyle: 'italic',
		fontSize: 16
	}

	return (
		<div style={footerStyle}> 
		<br />
			<em>Note App, Department of science, University of Helsinki 2021.</em>
		</div>
	)
}

const App = (props) => {

const [notes, setNotes] = useState([])
const [newNote, setNewNote] = useState('a new note')
const [showAll, setShowAll] = useState(true)
const [errorMessage, setErrorMessage] = useState('Some error happened...')

const hook = () => {
	noteService
	.getAll()
	.then( initialNotes => {
		setNotes(initialNotes)
	})
}

useEffect(hook, [])

const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  }

	noteService
		.create(noteObject)
		.then(returnedNote => { 
		setNotes(notes.concat(returnedNote))
		setNewNote('')
		})

  }
//------------------------------------------------------------------------------------ 
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
//------------------------------------------------------------------------------------ 
	const toggleImportanceOf = (id) => {
		const note = notes.find( n => n.id === id)
	const changedNote = { ...note, important: !note.important }
		noteService
		.update(id, changedNote)
			.then( returnedNote => {
				setNotes( notes.map( note => note.id !== id ? 
					note : returnedNote))
			})
			.catch( error => {
				setErrorMessage(`The note ${note.content}, has been already deleted from the server`)

				setTimeout(() => {setErrorMessage(null)}, 5000)
	
				setNotes(notes.filter( n => n.id !== id))
			})
	}
//------------------------------------------------------------------------------------ 
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
	  <Notification message={errorMessage} />
	<div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
	</div>
      <ul>
	  {notesToShow.map((note, i) => 
		  <Note
		  key={i} 
		  note={note} 
		  toggleImportance={() => toggleImportanceOf(note.id)}
		  /> )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} 
		onChange={handleNoteChange}
	  />

        <button type="submit">save</button>
      </form> 
	  <Footer />
    </div>
  )
}


export default App
