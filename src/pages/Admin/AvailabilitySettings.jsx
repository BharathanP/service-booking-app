import { useEffect, useState } from "react";
import axios from "axios";

const daysList = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function AdminServiceAvailability() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (id, field, value) => {
    setServices((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, availability: { ...s.availability, [field]: value } }
          : s
      )
    );
  };

  const handleDayToggle = (id, day) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s._id !== id) return s;

        const currentDays = s.availability?.days || [];
        const updatedDays = currentDays.includes(day)
          ? currentDays.filter((d) => d !== day)
          : [...currentDays, day];

        return {
          ...s,
          availability: { ...s.availability, days: updatedDays },
        };
      })
    );
  };

  const saveAvailability = async (service) => {
    try {
      await axios.put(
        `http://localhost:5000/api/services/${service._id}/availability`,
        service.availability
      );
      alert("Saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Service Availability Settings</h2>

      <div className="row">
        {services.map((s) => (
          <div key={s._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100 service-card">
              
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <i className="bi bi-gear-fill me-2"></i>
                  {s.name}
                </h5>

                {/* Days */}
                <div className="mb-3 d-flex flex-wrap gap-2">
                  {daysList.map((day) => (
                    <div key={day} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`${s._id}-${day}`}
                        checked={s.availability?.days?.includes(day) || false}
                        onChange={() => handleDayToggle(s._id, day)}
                      />
                      <label className="form-check-label" htmlFor={`${s._id}-${day}`}>
                        {day.slice(0,3)}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Time */}
                <div className="d-flex gap-2 mb-3">
                  <div className="flex-grow-1">
                    <label className="form-label small">Start Time</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={s.availability?.startTime || ""}
                      onChange={(e) =>
                        handleChange(s._id, "startTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex-grow-1">
                    <label className="form-label small">End Time</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={s.availability?.endTime || ""}
                      onChange={(e) =>
                        handleChange(s._id, "endTime", e.target.value)
                      }
                    />
                  </div>
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={() => saveAvailability(s)}
                >
                  <i className="bi bi-save me-1"></i> Save
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}