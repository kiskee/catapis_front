import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import DesprotectedRoute from "./components/utils/DesprotectedRoute";
import Register from "./pages/Register";
import ProtectedRoute from "./components/utils/ProtectedRoute";

import IntLayaout from "./components/IntLayaout";
import Home from "./pages/Home";
import BreedsPage from "./pages/BreedsPage";
import BreedsSearchPage from "./pages/BreedsSearchPage";
import BreedDetailPage from "./pages/BreedDetailPage";
import ImagesByBreedPage from "./pages/ImagesByBreedPage";

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
            <Route
              path="/breeds/search"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <BreedsSearchPage />
                    </IntLayaout>
                  }
                />
              }
            />
            <Route
              path="/breeds/:breed_id"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <BreedDetailPage  />
                    </IntLayaout>
                  }
                />
              }
            />
              <Route
              path="/images/by-breed"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <ImagesByBreedPage  />
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
