import React, { Suspense, lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

const Home = lazy(() => import("../pages/Home"));
const Markets = lazy(() => import("../pages/Markets"));
const Highlights = lazy(() => import("../pages/Highlights"));
const CoinDetails = lazy(() => import("../pages/CoinDetails"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/highlights/:section" element={<Highlights />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
        </Route>
      </Routes>
    </Suspense>
  );  
};

export default AppRoutes;
