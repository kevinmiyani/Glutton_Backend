import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore } from "date-fns";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import Modal from "./CalenderModal";
import { customer } from "../api/call";

const CalendarL = () => {
  const [notes, setNotes] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNote, setSelectedNote] = useState("");
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("uid"); // Assuming the user ID is stored in localStorage

  useEffect(() => {
    fetchNotes();
  }, [currentMonth, uid]);

  const fetchNotes = async () => {
    try {
      const response = await customer.getNotesbyUser(uid); 
      const fetchedNotes = response.data;

      // Transform notes into a format where the key is the date string
      const notesByDate = fetchedNotes.reduce((acc, note) => {
        const dateKey = format(new Date(note.createdAt), "yyyy-MM-dd");
        acc[dateKey] = {
          id: note._id, // Store the note ID
          content: note.note, // Store the note content
        };
        return acc;
      }, {});

      setNotes(notesByDate); // Update notes state
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleOpenModal = (date, note) => {
    setSelectedDate(date);
    setSelectedNote(note ? note.content : ""); // Set note content if it exists
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteContent) => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    try {
      const noteData = {
        userId: uid,
        note: noteContent,
        createdAt: selectedDate,
        updatedAt: new Date().toISOString(),
      };

      if (notes[dateKey]) {
        console.log("noteContent",noteContent);
        
        // Update existing note
        const noteId = notes[dateKey].id; // Retrieve note ID
        await customer.updatenote(noteId, { userId:uid,note: noteContent });
        // Update state to reflect the change
        setNotes((prevNotes) => ({
          ...prevNotes,
          [dateKey]: {
            id: noteId, // Keep the existing ID
            content: noteContent, // Update the content
          },
        }));
      } else {
        // Create new note
        const response = await customer.createNotes(noteData);
        // Add new note to state with the returned ID
        setNotes((prevNotes) => ({
          ...prevNotes,
          [dateKey]: {
            id: response.data._id, // Assuming the response contains the created note ID
            content: noteContent, // Store the new content
          },
        }));
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDeleteNote = async () => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    try {
      // Ensure that the note exists for the given date
      if (!notes[dateKey]) {
        throw new Error("No note found for this date.");
      }

      const noteId = notes[dateKey].id; // Retrieve the note ID from the state

      // Call API to delete the note
      await customer.delete(noteId);

      // Update state after deletion
      setNotes((prevNotes) => {
        const updatedNotes = { ...prevNotes };
        delete updatedNotes[dateKey]; // Remove the note for this date
        return updatedNotes;
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };
  
  return (
    <>
      <Breadcrumb pageName="Calendar" />
      <div className="my-4 flex justify-between">
        <button onClick={handlePrevMonth} className="p-2 bg-gray-200 rounded">
          Previous Month
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={handleNextMonth} className="p-2 bg-gray-200 rounded">
          Next Month
        </button>
      </div>

      {/* Calendar Table */}
      <div className="w-full max-w-full my-3 rounded-sm border border-stroke bg-white dark:bg-boxdark shadow-default">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 bg-green-600 dark:bg-green-700  text-white">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th key={day} className="p-2 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="grid grid-cols-7">
              {daysInMonth.map((day, index) => {
                const dayNote = notes[format(day, "yyyy-MM-dd")];
                const isPastDate = isBefore(day, new Date());

                return (
                  <td
                    key={index}
                    className={`border p-2 text-center relative ${isPastDate ? 'bg-gray-300' : 'bg-green-300 dark:bg-green-700'}`}
                    onClick={() => handleOpenModal(day, dayNote)} 
                  >
                    <div>
                      {format(day, "d")}
                      {dayNote && dayNote.content && (
                        <div className="text-red-600">•</div> // Indicator for existing note
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal for adding/editing notes */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={selectedNote}
        onDelete={handleDeleteNote}
      />
    </>
  );
};

export default CalendarL;
