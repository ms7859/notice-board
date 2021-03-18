import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, SetInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      setUserObj(user);
      SetInit(true);
    });
  }, [])

  return (
    <>
      {init ? <AppRouter userObj = {userObj} /> : "Initializing..." }
      <footer>&copy; {new Date().getFullYear()} 게시판</footer>
    </>
  );
}

export default App;

// No touch