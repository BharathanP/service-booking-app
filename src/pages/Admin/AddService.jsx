import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";


export default function AddService() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: null,
  });
  const [editId, setEditId] = useState(null); // track which service is being edited

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      if (form[key] !== null) formData.append(key, form[key]);
    }

    try {
      if (editId) {
        // Update existing service
        await axios.put(
          `http://localhost:5000/api/services/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Add new service
        await axios.post(
          "http://localhost:5000/api/services",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      // Reset form
      setForm({ name: "", description: "", price: "", duration: "", image: null });
      setEditId(null);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit service
  const handleEdit = (service) => {
    setEditId(service._id);
    setForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      duration: service.duration || "",
      image: null, // leave null, user can upload new image
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
  };

  return (

    
   <div className="container py-3">
  <div className="card p-4 shadow-sm mb-4">
    <h3 className="mb-3">
      {editId ? "Edit Service" : "Add Service"}
    </h3>


    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <input
          className="form-control"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="col-md-6">
        <input
          className="form-control"
          placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          required
        />
      </div>

      <div className="col-md-6">
        <input
          className="form-control"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
      </div>

      <div className="col-md-6">
        <input
          type="file"
          className="form-control"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
      </div>

      <div className="col-12">
        <textarea
          className="form-control"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="col-12 d-flex gap-2">
        <button className="btn btn-success">
          <i className="bi bi-check-circle me-1"></i>
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditId(null);
              setForm({
                name: "",
                description: "",
                price: "",
                duration: "",
                image: null,
              });
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </div>

  <h4 className="mb-3">All Services</h4>

  {/* ✅ CARD GRID */}
  <div className="dashboard-background">
  <div className="container">
    <div className="row">
      {services.map((s) => (
        <div key={s._id} className="col-md-4 mb-4">
          <div className="card service-card h-100">
            {s.image && (
              <img
                src={s.image.startsWith("http") ? s.image : `http://localhost:5000${s.image}`}
                className="card-img-top"
                style={{ height: "180px", objectFit: "cover" }}
                alt={s.name}
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{s.name}</h5>
              <p className="card-text text-muted">{s.description}</p>
              <p className="fw-bold">${s.price} • {s.duration} mins</p>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(s)}>
                <i className="bi bi-pencil-square"></i> Edit
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(s._id)}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  
</div> 
  );
}