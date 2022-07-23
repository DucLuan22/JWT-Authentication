import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";

//Screens
import LoginScreen from "./components/screen/LoginScreen";
import ForgotPasswordScreen from "./components/screen/ForgotPasswordScreen";
import RegisterScreen from "./components/screen/RegisterScreen";
import ResetScreen from "./components/screen/ResetScreen";
import PrivateScreen from "./components/screen/PrivateScreen";
import ConfirmScreen from "./components/screen/ConfirmScreen";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
          <Route path="/passwordreset/:resetToken" element={<ResetScreen />} />
          <Route
            path="/confirmregistration/:confirmToken"
            element={<ConfirmScreen />}
          />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<PrivateScreen />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
