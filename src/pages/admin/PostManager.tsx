import React, { useState, useEffect } from "react"
import { supabase } from '../../lib/supabase'

export default function PostManager() {
  const [notes, setNotes] = useState<any[]>([])
  const [title, setTitle] = useState("")

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from("notes").select("*")
      if (!error && data) setNotes(data)
    }
    fetchNotes()
  }, [])

  // Add a new note
  const addNote = async () => {
    if (!title.trim()) return
    
    // Generate a slug from the title
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    
    const { data, error } = await supabase.from("notes").insert([{ 
      title,
      slug,
      content: "New note content",
      excerpt: title.substring(0, 100)
    }]).select()
    
    if (!error && data) {
      setNotes([...notes, ...data])
      setTitle("")
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Manage Notes</h2>
        </div>
        <div className="p-6">
          <div className="flex space-x-2 mb-4">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
            />
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={addNote}
            >
              Add
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes yet.</p>
          ) : (
            <ul className="list-disc pl-6 space-y-1">
              {notes.map((note) => (
                <li key={note.id} className="text-gray-700">{note.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}