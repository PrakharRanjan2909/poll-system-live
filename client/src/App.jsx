import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/loginPage/LoginPage";
import TeacherHomePage from "./Pages/home-teacher/TeacherHomePage";
import StudentHomePage from "./Pages/home-student/StudentHomePage";
import PollPageStudent from "./Pages/poll-student/PollPageStudent";
import PollPageTeacher from "./Pages/teacher-poll/PollPageTeacher";
import PollHistoryPage from "./Pages/poll-history/PollHistory";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/teacher-home-page"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-home-page"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentHomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/poll-question"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PollPageStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-poll"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <PollPageTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-poll-history"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <PollHistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
