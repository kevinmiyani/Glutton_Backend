// Modal.js
import React from "react";

const CalenderModal = ({ isOpen, onClose, onSave, note, onDelete }) => {
    const [noteContent, setNoteContent] = React.useState(note || "");

    React.useEffect(() => {
        setNoteContent(note || "");
    }, [note]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                {/* Close button (X) in the corner */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>

                {/* Modal Title */}
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {note ? "Edit Note" : "Add Note"}
                </h2>

                {/* Textarea for note input */}
                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your note..."
                />

                {/* Modal Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSave(noteContent);
                            onClose();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Save
                    </button>

                    {note && (
                        <button
                            onClick={() => {
                                onDelete();
                                onClose();
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalenderModal;
