const BASE_URL = "http://localhost:5000/api";

export const fetchServices = async () => {
  const res = await fetch(`${BASE_URL}/services`);
  return res.json();
};

export const createBooking = async (data) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};