import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../lib/supabase";
import toast from 'react-hot-toast';

// Add missing import for supabase in AdminLogin
export { supabase };

// ------------------ Types ------------------
interface State {
  notes: any[];
  units: any[];
  years: any[];
  lecturers: any[];
  searchResults: any[];
  isSearching: boolean;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_NOTES"; payload: any[] }
  | { type: "SET_UNITS"; payload: any[] }
  | { type: "SET_YEARS"; payload: any[] }
  | { type: "SET_LECTURERS"; payload: any[] }
  | { type: "SET_SEARCH_RESULTS"; payload: any[] }
  | { type: "SET_SEARCHING"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_NOTE"; payload: any }
  | { type: "UPDATE_NOTE"; payload: any }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "ADD_UNIT"; payload: any }
  | { type: "UPDATE_UNIT"; payload: any }
  | { type: "DELETE_UNIT"; payload: string }
  | { type: "ADD_LECTURER"; payload: any }
  | { type: "UPDATE_LECTURER"; payload: any }
  | { type: "DELETE_LECTURER"; payload: string };

interface ContextType {
  state: State;
  fetchNotes: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchYears: () => Promise<void>;
  fetchLecturers: () => Promise<void>;
  searchNotes: (query: string, filters?: any) => Promise<void>;
  incrementNoteView: (noteId: string) => Promise<void>;
  createNote: (noteData: any) => Promise<void>;
  updateNote: (id: string, noteData: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  createUnit: (unitData: any) => Promise<void>;
  updateUnit: (id: string, unitData: any) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  createLecturer: (lecturerData: any) => Promise<void>;
  updateLecturer: (id: string, lecturerData: any) => Promise<void>;
  deleteLecturer: (id: string) => Promise<void>;
}

// ------------------ Initial State ------------------
const initialState: State = {
  notes: [],
  units: [],
  years: [],
  lecturers: [],
  searchResults: [],
  isSearching: false,
  loading: true,
  error: null,
};

// ------------------ Reducer ------------------
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.payload, loading: false };
    case "SET_UNITS":
      return { ...state, units: action.payload };
    case "SET_YEARS":
      return { ...state, years: action.payload };
    case "SET_LECTURERS":
      return { ...state, lecturers: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload, isSearching: false };
    case "SET_SEARCHING":
      return { ...state, isSearching: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "ADD_NOTE":
      return { ...state, notes: [action.payload, ...state.notes] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case "ADD_UNIT":
      return { ...state, units: [action.payload, ...state.units] };
    case "UPDATE_UNIT":
      return {
        ...state,
        units: state.units.map(unit =>
          unit.id === action.payload.id ? action.payload : unit
        ),
      };
    case "DELETE_UNIT":
      return {
        ...state,
        units: state.units.filter(unit => unit.id !== action.payload),
      };
    case "ADD_LECTURER":
      return { ...state, lecturers: [action.payload, ...state.lecturers] };
    case "UPDATE_LECTURER":
      return {
        ...state,
        lecturers: state.lecturers.map(lecturer =>
          lecturer.id === action.payload.id ? action.payload : lecturer
        ),
      };
    case "DELETE_LECTURER":
      return {
        ...state,
        lecturers: state.lecturers.filter(lecturer => lecturer.id !== action.payload),
      };
    default:
      return state;
  }
}

// ------------------ Context ------------------
const MedflyContext = createContext<ContextType | undefined>(undefined);

export const MedflyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // -------- Fetch Functions --------
  const fetchNotes = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      dispatch({ type: "SET_NOTES", payload: data || [] });
    } catch (error) {
      console.error("Error fetching notes:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch notes" });
    }
  };

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase
        .from("units")
        .select(`
          *,
          year:years(*),
          lecturer:lecturers(*)
        `)
        .order("unit_code");
      
      if (error) throw error;
      dispatch({ type: "SET_UNITS", payload: data || [] });
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const fetchYears = async () => {
    try {
      const { data, error } = await supabase
        .from("years")
        .select("*")
        .order("year_number");
      
      if (error) throw error;
      dispatch({ type: "SET_YEARS", payload: data || [] });
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchLecturers = async () => {
    try {
      const { data, error } = await supabase
        .from("lecturers")
        .select("*")
        .order("name");
      
      if (error) throw error;
      dispatch({ type: "SET_LECTURERS", payload: data || [] });
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    }
  };

  // -------- Search Function --------
  const searchNotes = async (query: string, filters: any = {}) => {
    try {
      dispatch({ type: "SET_SEARCHING", payload: true });
      
      let queryBuilder = supabase
        .from("notes")
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .eq("is_published", true);

      // Apply filters
      if (filters.yearId) {
        queryBuilder = queryBuilder.eq("year_id", filters.yearId);
      }
      if (filters.unitId) {
        queryBuilder = queryBuilder.eq("unit_id", filters.unitId);
      }
      if (filters.lecturerId) {
        queryBuilder = queryBuilder.eq("lecturer_id", filters.lecturerId);
      }
      if (filters.difficultyLevel) {
        queryBuilder = queryBuilder.eq("difficulty_level", filters.difficultyLevel);
      }

      // Apply text search
      if (query.trim()) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.order("created_at", { ascending: false });
      
      if (error) throw error;
      dispatch({ type: "SET_SEARCH_RESULTS", payload: data || [] });
    } catch (error) {
      console.error("Error searching notes:", error);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
    }
  };

  // -------- CRUD Functions --------
  const createNote = async (noteData: any) => {
    try {
      console.log('Creating note with data:', noteData);
      
      // Ensure required fields are present
      if (!noteData.title || !noteData.content || !noteData.unit_id || !noteData.year_id) {
        throw new Error('Missing required fields: title, content, unit_id, and year_id are required');
      }
      
      // Generate slug if not provided
      if (!noteData.slug) {
        noteData.slug = noteData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      const { data, error } = await supabase
        .from("notes")
        .insert(noteData)
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      console.log('Supabase response:', { data, error });

      if (error) throw error;
      
      dispatch({ type: "ADD_NOTE", payload: data });
      toast.success("Note created successfully!");
      
      // Refresh all data to ensure consistency
      await fetchNotes();
      
      console.log('✅ Note created successfully:', data);
    } catch (error) {
      console.error("Error creating note:", error);
      console.error("Full error details:", error);
      toast.error("Failed to create note");
      throw error;
    }
  };

  const updateNote = async (id: string, noteData: any) => {
    try {
      console.log('Updating note:', id, 'with data:', noteData);
      
      // Ensure slug is generated if title changed
      if (noteData.title && !noteData.slug) {
        noteData.slug = noteData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      const { data, error } = await supabase
        .from("notes")
        .update(noteData)
        .eq("id", id)
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      console.log('Update response:', { data, error });

      if (error) throw error;
      
      dispatch({ type: "UPDATE_NOTE", payload: data });
      toast.success("Note updated successfully!");
      
      // Refresh all data to ensure consistency
      await fetchNotes();
      
      console.log('✅ Note updated successfully:', data);
    } catch (error) {
      console.error("Error updating note:", error);
      console.error("Full error details:", error);
      toast.error("Failed to update note");
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      console.log('Deleting note:', id);
      
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      console.log('Delete response:', { error });

      if (error) throw error;
      
      dispatch({ type: "DELETE_NOTE", payload: id });
      toast.success("Note deleted successfully!");
      
      // Refresh all data to ensure consistency
      await fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      console.error("Full error details:", error);
      toast.error("Failed to delete note");
      throw error;
    }
  };

  const createUnit = async (unitData: any) => {
    try {
      console.log('Creating unit with data:', unitData);
      
      const { data, error } = await supabase
        .from("units")
        .insert(unitData)
        .select(`
          *,
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      console.log('Unit creation response:', { data, error });

      if (error) throw error;
      
      dispatch({ type: "ADD_UNIT", payload: data });
      toast.success("Unit created successfully!");
      
      // Refresh all data
      await fetchUnits();
    } catch (error) {
      console.error("Error creating unit:", error);
      console.error("Full error details:", error);
      toast.error("Failed to create unit");
      throw error;
    }
  };

  const updateUnit = async (id: string, unitData: any) => {
    try {
      console.log('Updating unit:', id, 'with data:', unitData);
      
      const { data, error } = await supabase
        .from("units")
        .update(unitData)
        .eq("id", id)
        .select(`
          *,
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      console.log('Unit update response:', { data, error });

      if (error) throw error;
      
      dispatch({ type: "UPDATE_UNIT", payload: data });
      toast.success("Unit updated successfully!");
      
      // Refresh all data
      await fetchUnits();
    } catch (error) {
      console.error("Error updating unit:", error);
      console.error("Full error details:", error);
      toast.error("Failed to update unit");
      throw error;
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      console.log('Deleting unit:', id);
      
      const { error } = await supabase
        .from("units")
        .delete()
        .eq("id", id);

      console.log('Unit delete response:', { error });

      if (error) throw error;
      
      dispatch({ type: "DELETE_UNIT", payload: id });
      toast.success("Unit deleted successfully!");
      
      // Refresh all data
      await fetchUnits();
    } catch (error) {
      console.error("Error deleting unit:", error);
      console.error("Full error details:", error);
      toast.error("Failed to delete unit");
      throw error;
    }
  };

  const createLecturer = async (lecturerData: any) => {
    try {
      console.log('Creating lecturer with data:', lecturerData);
      
      const { data, error } = await supabase
        .from("lecturers")
        .insert(lecturerData)
        .select()
        .single();

      console.log('Lecturer creation response:', { data, error });

      if (error) throw error;
      
      dispatch({ type: "ADD_LECTURER", payload: data });
      toast.success("Lecturer created successfully!");
      
      // Refresh all data
      await fetchLecturers();
    } catch (error) {
      console.error("Error creating lecturer:", error);
      console.error("Full error details:", error);
      toast.error("Failed to create lecturer");
      throw error;
    }
  };

  const updateLecturer = async (id: string, lecturerData: any) => {
    try {
      console.log('Updating lecturer:', id, 'with data:', lecturerData);
      
      const { data, error } = await supabase
        .from("lecturers")
        .update(lecturerData)
        .eq("id", id)
        .select()
        .single();

      console.log('Lecturer update response:', { data, error });

      if (error) throw error;
      
      dispatch({ type: "UPDATE_LECTURER", payload: data });
      toast.success("Lecturer updated successfully!");
      
      // Refresh all data
      await fetchLecturers();
    } catch (error) {
      console.error("Error updating lecturer:", error);
      console.error("Full error details:", error);
      toast.error("Failed to update lecturer");
      throw error;
    }
  };

  const deleteLecturer = async (id: string) => {
    try {
      console.log('Deleting lecturer:', id);
      
      const { error } = await supabase
        .from("lecturers")
        .delete()
        .eq("id", id);

      console.log('Lecturer delete response:', { error });

      if (error) throw error;
      
      dispatch({ type: "DELETE_LECTURER", payload: id });
      toast.success("Lecturer deleted successfully!");
      
      // Refresh all data
      await fetchLecturers();
    } catch (error) {
      console.error("Error deleting lecturer:", error);
      console.error("Full error details:", error);
      toast.error("Failed to delete lecturer");
      throw error;
    }
  };

  // -------- FIXED incrementNoteView --------
  const incrementNoteView = async (noteId: string) => {
    try {
      // First get current view count
      const { data: currentNote } = await supabase
        .from("notes")
        .select("view_count")
        .eq("id", noteId)
        .single();
        
      const currentCount = currentNote?.view_count || 0;
      
      // Update with incremented count
      const { error } = await supabase
        .from("notes")
        .update({ 
          view_count: currentCount + 1
        })
        .eq("id", noteId);

      if (error) {
        console.error("Error updating view count:", error);
      } else {
        // Refresh notes to show updated count
        await fetchNotes();
      }
    } catch (err) {
      console.error("Error incrementing note view:", err);
    }
  };

  // -------- Real-time Subscriptions --------
  useEffect(() => {
    // Initial data fetch
    fetchNotes();
    fetchUnits();
    fetchYears();
    fetchLecturers();

    // Set up real-time subscriptions
    const notesSubscription = supabase
      .channel('notes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Notes change received:', payload);
          fetchNotes(); // Refetch to get updated data with relationships
        }
      )
      .subscribe();

    const unitsSubscription = supabase
      .channel('units_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'units' },
        (payload) => {
          console.log('Units change received:', payload);
          fetchUnits();
        }
      )
      .subscribe();

    const lecturersSubscription = supabase
      .channel('lecturers_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'lecturers' },
        (payload) => {
          console.log('Lecturers change received:', payload);
          fetchLecturers();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(notesSubscription);
      supabase.removeChannel(unitsSubscription);
      supabase.removeChannel(lecturersSubscription);
    };
  }, []);

  return (
    <MedflyContext.Provider
      value={{
        state,
        fetchNotes,
        fetchUnits,
        fetchYears,
        fetchLecturers,
        searchNotes,
        incrementNoteView,
        createNote,
        updateNote,
        deleteNote,
        createUnit,
        updateUnit,
        deleteUnit,
        createLecturer,
        updateLecturer,
        deleteLecturer,
      }}
    >
      {children}
    </MedflyContext.Provider>
  );
};

// ------------------ Hook ------------------
export const useMedfly = () => {
  const context = useContext(MedflyContext);
  if (!context) {
    throw new Error("useMedfly must be used within a MedflyProvider");
  }
  return context;
};