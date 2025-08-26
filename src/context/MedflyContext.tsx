import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../supabaseClient";

// ------------------ Types ------------------
interface State {
  notes: any[];
  units: any[];
  years: any[];
  lecturers: any[];
  loading: boolean;
}

type Action =
  | { type: "SET_NOTES"; payload: any[] }
  | { type: "SET_UNITS"; payload: any[] }
  | { type: "SET_YEARS"; payload: any[] }
  | { type: "SET_LECTURERS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean };

interface ContextType {
  state: State;
  fetchNotes: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchYears: () => Promise<void>;
  fetchLecturers: () => Promise<void>;
  incrementNoteView: (noteId: string) => Promise<void>;
}

// ------------------ Initial State ------------------
const initialState: State = {
  notes: [],
  units: [],
  years: [],
  lecturers: [],
  loading: true,
};

// ------------------ Reducer ------------------
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "SET_UNITS":
      return { ...state, units: action.payload };
    case "SET_YEARS":
      return { ...state, years: action.payload };
    case "SET_LECTURERS":
      return { ...state, lecturers: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
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
    dispatch({ type: "SET_LOADING", payload: true });
    const { data, error } = await supabase
      .from("notes")
      .select("*, unit(*), year(*), lecturer(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching notes:", error);
    else dispatch({ type: "SET_NOTES", payload: data || [] });
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const fetchUnits = async () => {
    const { data, error } = await supabase.from("units").select("*");
    if (error) console.error("Error fetching units:", error);
    else dispatch({ type: "SET_UNITS", payload: data || [] });
  };

  const fetchYears = async () => {
    const { data, error } = await supabase.from("years").select("*");
    if (error) console.error("Error fetching years:", error);
    else dispatch({ type: "SET_YEARS", payload: data || [] });
  };

  const fetchLecturers = async () => {
    const { data, error } = await supabase.from("lecturers").select("*");
    if (error) console.error("Error fetching lecturers:", error);
    else dispatch({ type: "SET_LECTURERS", payload: data || [] });
  };

  // -------- FIXED incrementNoteView --------
  const incrementNoteView = async (noteId: string) => {
    try {
      // 1. Get current view count
      const { data, error } = await supabase
        .from("notes")
        .select("view_count")
        .eq("id", noteId)
        .single();

      if (error) {
        console.error("Error fetching current views:", error);
        return;
      }

      // 2. Increment by 1
      const { error: updateError } = await supabase
        .from("notes")
        .update({ view_count: (data?.view_count || 0) + 1 })
        .eq("id", noteId);

      if (updateError) {
        console.error("Error updating view count:", updateError);
      }
    } catch (err) {
      console.error("Error incrementing note view:", err);
    }
  };

  // -------- Initial Load --------
  useEffect(() => {
    fetchNotes();
    fetchUnits();
    fetchYears();
    fetchLecturers();
  }, []);

  return (
    <MedflyContext.Provider
      value={{
        state,
        fetchNotes,
        fetchUnits,
        fetchYears,
        fetchLecturers,
        incrementNoteView,
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
