// Default Import

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { useState } from "react";
import { Toaster } from "react-hot-toast";

// Layout

import Layout from "@/layouts/root-layout";

// Utility Pages / Components

import ScrollToTop from "./utility/ScrollToTop";
import CustomCursor from "./utility/CustomCursor";
import ScrollToTopFunction from "./utility/ScrollToTopFunction";
import NotFoundPage from "./pages/Utility/NotFound404";
import LoadingScreen from "./pages/Utility/LoadingScreen";

// Pages

import LandingPage from "@/pages/Landing/page";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import ShopPage from "./pages/Shop/Store";
import BookDetailPage from "./pages/Shop/[id]/Book";
import AdminPage from "./pages/Admin/page";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/Cart/page";
import TransactionsPage from "./pages/Transaction/page";
import TransactionDetailPage from "./pages/Transaction/[id]/page";

function App() {

  const [loading, setLoading] = useState(true);

  return (

    // Providers, Router, Scroll to Top Function and Button, and Custom Cursor

    <BrowserRouter>
      <ScrollToTopFunction />
      <ScrollToTop />
      <CustomCursor />

      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} />
      )}

      <AnimatePresence mode="wait">

        {!loading && (

          <Routes>

            <Route path="/" element={<Layout />}>
              
                <Route index element={<LandingPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />

                <Route path="/shop" element={<ShopPage/>} />

                <Route path="/book/:id" element={<BookDetailPage/>} />

                <Route path="/cart" element={
                    <ProtectedRoute>
                      <CartPage/>
                    </ProtectedRoute>
                } />

                <Route path="/transaction" element={<TransactionsPage/>} />

                <Route path="/transactions/:id" element={<TransactionDetailPage/>} />

                <Route path="*" element={<NotFoundPage />} />

            </Route>

            <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminPage/>
                    </ProtectedRoute>
                } />

          </Routes>

        )}

      </AnimatePresence>

      <Toaster position="top-center" />

    </BrowserRouter>

  );
}

export default App;
