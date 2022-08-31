import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Graph from "./components/Graph";
import Header from "./components/Header";
import PrefectureDetail from "./components/PrefectureDetail";
import Top from "./components/Top";
import WholeCountryDetail from "./components/WholeCountryDetail";

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Top />} />
          <Route path={`/graph/`} element={<Graph />} />
          <Route path={`/:id`} element={<PrefectureDetail />} />
          <Route path={`/whole`} element={<WholeCountryDetail />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
