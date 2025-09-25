// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CreatePoll from "./features/polls/CreatePoll";
import PollList from "./features/polls/PollList";
import PollVote from "./features/polls/PollVote";
import PollResult from "./features/polls/PollResult";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import "./App.css";
import Logout from "./features/auth/Logout";

function App() {
  return (
    <Router>
      <Layout>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/create/polls/" element={<CreatePoll />} />
            <Route path="/poll/:id/vote" element={<PollVote />} />
            <Route path="/poll/:id/result" element={<PollResult />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />            
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;

