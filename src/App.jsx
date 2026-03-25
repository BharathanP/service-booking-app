import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServicesPage from "./pages/ServicesPage";
import SlotPage from "./pages/SlotSelectionPage";
import BookingSummary from "./pages/BookingSummaryPage";
import CartSidebar from "./components/CartSidebar";
import Dashboard from "./pages/Admin/Admindash";
import AdminLogin from "./pages/Admin/AdminLogin";

function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: 1 }}>{children}</div>
      <CartSidebar /> {/* Sidebar always visible */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <ServicesPage />
            </Layout>
          }
        />

        <Route
          path="/slot"
          element={
            <Layout>
              <SlotPage />
            </Layout>
          }
        />
        <Route
          path="/summary"
          element={
            <Layout>
              <BookingSummary />
            </Layout>
          }
        />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
