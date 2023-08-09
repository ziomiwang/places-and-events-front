import React from "react";
import "./App.css";
import Events from "components/events/Events";
import { useSelector } from "react-redux";
import { RootState } from "redux/rootReducer";
import RegisterDemo from "components/registerdemo/RegisterDemo";
import Router from "routes/Router";

function App() {
  const { name } = useSelector((state: RootState) => state.user);

  return (
    <div
      className="App"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Router/>
      {/*{name !== "" ? <Events /> : <RegisterDemo />}*/}
    </div>
  );
}

export default App;
