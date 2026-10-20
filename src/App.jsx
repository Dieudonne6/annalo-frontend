import { Route, Routes } from "react-router-dom";

import AdminLayout from "./admin/AdminLayout.jsx";
import Announcements from "./admin/pages/Announcements.jsx";
import Categories from "./admin/pages/Categories.jsx";
import Contributions from "./admin/pages/Contributions.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Pricing from "./admin/pages/Pricing.jsx";
import Settings from "./admin/pages/Settings.jsx";
import Subjects from "./admin/pages/Subjects.jsx";
import Subscribers from "./admin/pages/Subscribers.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import Account from "./pages/Account.jsx";
import Home from "./pages/Home.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route
        path="/compte"
        element={
          <PublicLayout>
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          </PublicLayout>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="sujets" element={<Subjects />} />
        <Route path="categories" element={<Categories />} />
        <Route path="tarifs" element={<Pricing />} />
        <Route path="abonnes" element={<Subscribers />} />
        <Route path="contributions" element={<Contributions />} />
        <Route path="annonces" element={<Announcements />} />
        <Route path="parametres" element={<Settings />} />
      </Route>
    </Routes>
  );
}
