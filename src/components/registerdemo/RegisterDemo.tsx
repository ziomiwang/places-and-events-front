import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import { setUsername } from "user/service/UserSlice";

const RegisterDemo = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const onRegister = useCallback(() => {
    if (name !== "") {
      dispatch(setUsername(name));
    }
  }, [dispatch, name]);

  return (
    <div>
      <input
        placeholder={"enter username"}
        onChange={(event) => setName(event.target.value)}
      />
      <button onClick={onRegister}>Register</button>
    </div>
  );
};

export default RegisterDemo;
