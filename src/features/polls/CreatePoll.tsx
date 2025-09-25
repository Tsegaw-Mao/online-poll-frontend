import { useState } from "react";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

const CreatePoll = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || options.some((o) => !o)) {
      alert("❌ Title and all options are required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        expiry_date: expiryDate || undefined,
        options,
      };

      const response = await api.post(ENDPOINTS.POLLS.CREATE, payload);

      alert("✅ Poll created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setExpiryDate("");
      setOptions(["", ""]);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Error creating poll";
      console.error("CreatePoll error:", msg);
      alert(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Poll</h1>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white shadow rounded-lg space-y-4"
      >
        <input
          type="text"
          placeholder="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="datetime-local"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full border rounded p-2"
        />

        <div>
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="w-full border rounded p-2 mb-2"
            />
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-blue-600 hover:underline"
          >
            + Add Option
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
