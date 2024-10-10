import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Login from './features/auth/Login';
import Layout from './components/Layout'
import RequireAuth from "./features/auth/RequireAuth";
import Graph from "./features/graph/Graph";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Login />} />

          <Route element={<RequireAuth />}>
            <Route path="graph" element={<Graph />} />
          </Route>
        </Route>
      </Routes>
  );
};

export default App;
/*
<Routes>
    <Route path="/" element={<Layout />}>
      {}
      <Route path="login" element={<Register />} />

      {}
    </Route>
  </Routes>
*/