import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./admin/AdminLayout.jsx";
import Announcements from "./admin/pages/Announcements.jsx";
import Categories from "./admin/pages/Categories.jsx";
import Contributions from "./admin/pages/Contributions.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Pricing from "./admin/pages/Pricing.jsx";
import Settings from "./admin/pages/Settings.jsx";
import Subjects from "./admin/pages/Subjects.jsx";
import Subscribers from "./admin/pages/Subscribers.jsx";
import AuthModal from "./components/auth/AuthModal.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";
import Toast from "./components/common/Toast.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import AccountModal from "./components/modals/AccountModal.jsx";
import AnnouncementModal from "./components/modals/AnnouncementModal.jsx";
import ContactModal from "./components/modals/ContactModal.jsx";
import ContributeModal from "./components/modals/ContributeModal.jsx";
import PaperDetailModal from "./components/modals/PaperDetailModal.jsx";
import { useUI } from "./context/UIContext.jsx";
import Home from "./pages/Home.jsx";
import PaymentReturn from "./pages/PaymentReturn.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <AuthModal />
      <ContactModal />
      <AccountModal />
      <PaperDetailModal />
      <AnnouncementModal />
      <ContributeModal />
      <Toast />
    </>
  );
}

// Le compte est une modale (comme dans la maquette) : /compte l'ouvre sur l'accueil.
function OpenAccount() {
  const { openModal } = useUI();
  useEffect(() => openModal("account"), [openModal]);
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/paiement/retour" element={<PublicLayout><PaymentReturn /></PublicLayout>} />
      <Route path="/compte" element={<ProtectedRoute><OpenAccount /></ProtectedRoute>} />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
