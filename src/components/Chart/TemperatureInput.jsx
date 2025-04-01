import React, { useState } from "react";
import { db } from "@/firebase/db.config";
import { doc, setDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";

const TemperatureInput = ({ deviceId }) => {
  const [temperatures, setTemperatures] = useState({ temp1: "", temp2: "", temp3: "" });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (e) => {
    setTemperatures({ ...temperatures, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId) return;

    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      await setDoc(doc(db, `devices/${deviceId}/temperatureLogs`, timestamp), {
        temp1: parseFloat(temperatures.temp1),
        temp2: parseFloat(temperatures.temp2),
        temp3: parseFloat(temperatures.temp3),
        timestamp: new Date(),
      });

      setTemperatures({ temp1: "", temp2: "", temp3: "" });
    } catch (error) {
      console.error("Lỗi khi gửi nhiệt độ:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg font-bold mb-3">🌡️ Nhập nhiệt độ cảm biến</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.keys(temperatures).map((key, index) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">Cảm biến {index + 1}:</label>
              <input
                type="number"
                name={key}
                value={temperatures[key]}
                onChange={handleChange}
                placeholder={`Nhập nhiệt độ cảm biến ${index + 1}`}
                className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className={`w-full py-2 text-white text-lg font-semibold rounded-lg transition ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"}`}
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </div>
  );
};

export default TemperatureInput;
