import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Year, Lecturer, Unit, Tag, Note } from '../lib/supabase';

interface MedflyState {
  years: Year[];
  lecturers: Lecturer[];
  units: Unit[];
  tags: Tag[];
  notes: Note[];
  loading: boolean;
  currentUser: any;
  error: string | null;
  searchResults: Note[];
  isSearching: boolean;
}

type MedflyAction = 
  | { type: 'SET_YEARS'; payload: Year[] }
  | { type: 'SET_LECTURERS'; payload: Lecturer[] }
  | { type: 'SET_UNITS'; payload: Unit[] }
  | { type: 'SET_TAGS'; payload: Tag[] }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_SEARCH_RESULTS'; payload: Note[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'UPDATE_UNIT'; payload: Unit }
  | { type: 'DELETE_UNIT'; payload: string }
  | { type: 'ADD_LECTURER'; payload: Lecturer }
  | { type: 'UPDATE_LECTURER'; payload: Lecturer }
  | { type: 'DELETE_LECTURER'; payload: string };

const initialState: MedflyState = {
  years: [],
  lecturers: [],
  units: [],
  tags: [],
  notes: [],
  loading: false,
  currentUser: null,
  error: null,
  searchResults: [],
  isSearching: false,
};

const medflyReducer = (state: MedflyState, action: MedflyAction): MedflyState => {
  switch (action.type) {
    case 'SET_YEARS':
      return { ...state, years: action.payload, loading: false };
    case 'SET_LECTURERS':
      return { ...state, lecturers: action.payload, loading: false };
    case 'SET_UNITS':
      return { ...state, units: action.payload, loading: false };
    case 'SET_TAGS':
      return { ...state, tags: action.payload, loading: false };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, isSearching: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case 'ADD_UNIT':
      return { ...state, units: [...state.units, action.payload] };
    case 'UPDATE_UNIT':
      return {
        ...state,
        units: state.units.map(unit =>
          unit.id === action.payload.id ? action.payload : unit
        ),
      };
    case 'DELETE_UNIT':
      return {
        ...state,
        units: state.units.filter(unit => unit.id !== action.payload),
      };
    case 'ADD_LECTURER':
      return { ...state, lecturers: [...state.lecturers, action.payload] };
    case 'UPDATE_LECTURER':
      return {
        ...state,
        lecturers: state.lecturers.map(lecturer =>
          lecturer.id === action.payload.id ? action.payload : lecturer
        ),
      };
    case 'DELETE_LECTURER':
      return {
        ...state,
        lecturers: state.lecturers.filter(lecturer => lecturer.id !== action.payload),
      };
    default:
      return state;
  }
};

const MedflyContext = createContext<{
  state: MedflyState;
  dispatch: React.Dispatch<MedflyAction>;
  fetchYears: () => Promise<void>;
  fetchLecturers: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  searchNotes: (query: string, filters?: any) => Promise<void>;
  createNote: (note: any) => Promise<void>;
  updateNote: (id: string, note: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  createUnit: (unit: any) => Promise<void>;
  updateUnit: (id: string, unit: any) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  createLecturer: (lecturer: any) => Promise<void>;
  updateLecturer: (id: string, lecturer: any) => Promise<void>;
  deleteLecturer: (id: string) => Promise<void>;
  incrementNoteView: (noteId: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  fetchYears: async () => {},
  fetchLecturers: async () => {},
  fetchUnits: async () => {},
  fetchTags: async () => {},
  fetchNotes: async () => {},
  searchNotes: async () => {},
  createNote: async () => {},
  updateNote: async () => {},
  deleteNote: async () => {},
  createUnit: async () => {},
  updateUnit: async () => {},
  deleteUnit: async () => {},
  createLecturer: async () => {},
  updateLecturer: async () => {},
  deleteLecturer: async () => {},
  incrementNoteView: async () => {},
});

export const MedflyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(medflyReducer, initialState);

  // Fetch years
  const fetchYears = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: years, error } = await supabase
        .from('years')
        .select('*')
        .order('year_number');

      if (error) throw error;
      dispatch({ type: 'SET_YEARS', payload: years || [] });
    } catch (error) {
      console.error('Error fetching years:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch years' });
    }
  };

  // Fetch lecturers
  const fetchLecturers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: lecturers, error } = await supabase
        .from('lecturers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      dispatch({ type: 'SET_LECTURERS', payload: lecturers || [] });
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch lecturers' });
    }
  };

  // Fetch units with relationships
  const fetchUnits = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: units, error } = await supabase
        .from('units')
        .select(`
          *,
          year:years(*),
          lecturer:lecturers(*)
        `)
        .eq('is_active', true)
        .order('unit_name');

      if (error) throw error;
      dispatch({ type: 'SET_UNITS', payload: units || [] });
    } catch (error) {
      console.error('Error fetching units:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch units' });
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: tags, error } = await supabase
        .from('tags')
        .select('*')
        .order('tag_name');

      if (error) throw error;
      dispatch({ type: 'SET_TAGS', payload: tags || [] });
    } catch (error) {
      console.error('Error fetching tags:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tags' });
    }
  };

  // Fetch notes with relationships
  const fetchNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: notes, error } = await supabase
        .from('notes')
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*),
          tags:note_tags(tag:tags(*))
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to flatten tags
      const transformedNotes = notes?.map(note => ({
        ...note,
        tags: note.tags?.map((nt: any) => nt.tag) || []
      })) || [];

      dispatch({ type: 'SET_NOTES', payload: transformedNotes });
    } catch (error) {
      console.error('Error fetching notes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notes' });
    }
  };

  // Search notes
  const searchNotes = async (query: string, filters: any = {}) => {
    try {
      dispatch({ type: 'SET_SEARCHING', payload: true });
      
      let queryBuilder = supabase
        .from('notes')
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*),
          tags:note_tags(tag:tags(*))
        `)
        .eq('is_published', true);

      // Add text search
      if (query.trim()) {
        queryBuilder = queryBuilder.textSearch('title,content,excerpt', query);
      }

      // Add filters
      if (filters.yearId) {
        queryBuilder = queryBuilder.eq('year_id', filters.yearId);
      }
      if (filters.unitId) {
        queryBuilder = queryBuilder.eq('unit_id', filters.unitId);
      }
      if (filters.lecturerId) {
        queryBuilder = queryBuilder.eq('lecturer_id', filters.lecturerId);
      }
      if (filters.difficultyLevel) {
        queryBuilder = queryBuilder.eq('difficulty_level', filters.difficultyLevel);
      }

      const { data: notes, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform the data to flatten tags
      const transformedNotes = notes?.map(note => ({
        ...note,
        tags: note.tags?.map((nt: any) => nt.tag) || []
      })) || [];

      dispatch({ type: 'SET_SEARCH_RESULTS', payload: transformedNotes });
    } catch (error) {
      console.error('Error searching notes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search notes' });
      dispatch({ type: 'SET_SEARCHING', payload: false });
    }
  };

  // Create note
  const createNote = async (noteData: any) => {
    try {
      const { data: note, error } = await supabase
        .from('notes')
        .insert(noteData)
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_NOTE', payload: note });
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  // Update note
  const updateNote = async (id: string, noteData: any) => {
    try {
      const { data: note, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', id)
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      if (error) throw error;
      dispatch({ type: 'UPDATE_NOTE', payload: note });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  // Delete note
  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  // Create unit
  const createUnit = async (unitData: any) => {
    try {
      const { data: unit, error } = await supabase
        .from('units')
        .insert(unitData)
        .select(`
          *,
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_UNIT', payload: unit });
    } catch (error) {
      console.error('Error creating unit:', error);
      throw error;
    }
  };

  // Update unit
  const updateUnit = async (id: string, unitData: any) => {
    try {
      const { data: unit, error } = await supabase
        .from('units')
        .update(unitData)
        .eq('id', id)
        .select(`
          *,
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      if (error) throw error;
      dispatch({ type: 'UPDATE_UNIT', payload: unit });
    } catch (error) {
      console.error('Error updating unit:', error);
      throw error;
    }
  };

  // Delete unit
  const deleteUnit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_UNIT', payload: id });
    } catch (error) {
      console.error('Error deleting unit:', error);
      throw error;
    }
  };

  // Create lecturer
  const createLecturer = async (lecturerData: any) => {
    try {
      const { data: lecturer, error } = await supabase
        .from('lecturers')
        .insert(lecturerData)
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_LECTURER', payload: lecturer });
    } catch (error) {
      console.error('Error creating lecturer:', error);
      throw error;
    }
  };

  // Update lecturer
  const updateLecturer = async (id: string, lecturerData: any) => {
    try {
      const { data: lecturer, error } = await supabase
        .from('lecturers')
        .update(lecturerData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'UPDATE_LECTURER', payload: lecturer });
    } catch (error) {
      console.error('Error updating lecturer:', error);
      throw error;
    }
  };

  // Delete lecturer
  const deleteLecturer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lecturers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_LECTURER', payload: id });
    } catch (error) {
      console.error('Error deleting lecturer:', error);
      throw error;
    }
  };

  // Increment note view count
  const incrementNoteView = async (noteId: string) => {
    try {
      // Insert view record
      await supabase
        .from('note_views')
        .insert({
          note_id: noteId,
          user_agent: navigator.userAgent,
        });

      // Update view count
      await supabase.rpc('increment_note_view_count', { note_id: noteId });
    } catch (error) {
      console.error('Error incrementing note view:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Initial data fetch
    fetchYears();
    fetchLecturers();
    fetchUnits();
    fetchTags();
    fetchNotes();

    // Set up real-time subscriptions
    const notesSubscription = supabase
      .channel('notes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notes' },
        () => fetchNotes()
      )
      .subscribe();

    const unitsSubscription = supabase
      .channel('units_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'units' },
        () => fetchUnits()
      )
      .subscribe();

    const lecturersSubscription = supabase
      .channel('lecturers_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'lecturers' },
        () => fetchLecturers()
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(notesSubscription);
      supabase.removeChannel(unitsSubscription);
      supabase.removeChannel(lecturersSubscription);
    };
  }, []);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        dispatch({ type: 'SET_USER', payload: session.user });
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        dispatch({ type: 'SET_USER', payload: session.user });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <MedflyContext.Provider value={{ 
      state, 
      dispatch,
      fetchYears,
      fetchLecturers,
      fetchUnits,
      fetchTags,
      fetchNotes,
      searchNotes,
      createNote,
      updateNote,
      deleteNote,
      createUnit,
      updateUnit,
      deleteUnit,
      createLecturer,
      updateLecturer,
      deleteLecturer,
      incrementNoteView
    }}>
      {children}
    </MedflyContext.Provider>
  );
};

export const useMedfly = () => {
  const context = useContext(MedflyContext);
  if (context === undefined) {
    throw new Error('useMedfly must be used within a MedflyProvider');
  }
  return context;
};