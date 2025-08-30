import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import DesprotectedRoute from "./components/utils/DesprotectedRoute";
import Register from "./pages/Register";
import ProtectedRoute from "./components/utils/ProtectedRoute";

import IntLayaout from "./components/IntLayaout";
import Home from "./pages/Home";
import BreedsPage from "./pages/BreedsPage";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/"
              element={<DesprotectedRoute element={<Login />} />}
            />
            <Route
              path="/register"
              element={<DesprotectedRoute element={<Register />} />}
            />
            {/* Rutas protegidas con IntLayout */}
            <Route
              path="/home"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <Home />
                    </IntLayaout>
                  }
                />
              }
            />
            <Route
              path="/breeds"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <BreedsPage />
                    </IntLayaout>
                  }
                />
              }
            />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
