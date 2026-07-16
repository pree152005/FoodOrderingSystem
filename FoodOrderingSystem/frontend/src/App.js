import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <ToastProvider>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/order/:foodId" element={<Order />} />
                        <Route path="/payment/:orderId" element={<Payment />} />
                        <Route path="/success/:orderId" element={<Success />} />
                        <Route path="/history" element={<History />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </ToastProvider>
    );
}
