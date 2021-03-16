/*
useState(state_초기값): state의 초기값을 인자로 전달하며 배열을 반환. 이때 반환되는 배열의 첫 번째 요소는 현재 상태, 두 번째 요소는 Setter함수
useEffect(function, [states, ...]): componentDidMount, componentWillUnmount, componentDidUpdate의 역할을 모두 함.
                                   인자로 함수와 배열을 전달하며, 배열에는 state(?)를 넣는다. 배열 안의 state가 update되면 함수가 실행된다.

firebase.auth().onAuthStateChanged((user) => {}): 사용자의 로그인 상태의 변화를 관찰하여 상태가 변하면 실행된다. user에는 현재 로그인한 계정의 정보가 전달되며, 로그인이 되어있지 않으면 user는 null
*/

import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  // init에는 false가, SetInit에는 init의 값을 설정하는 Setter 함수가 저장됨. 이후에 SetInit 함수를 호출하면 init의 값이 수정되는 듯.
  const [init, SetInit] = useState(false);      // userObj의 초기화 여부 확인(초기값은 false이며, 초기화가 완료되면 true로 바뀜)
  const [userObj, setUserObj] = useState(null); // 현재 로그인된 계정의 정보를 저장하기 위한 state. 기존의 isLoggedIn의 역할까지 모두 userObj가 함.

  // componentDidMount
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      setUserObj(user); // 로그인이 완료되면 사용자의 정보를 userObj에 저장
      SetInit(true);
    });
  }, []) // 위의 useEffect는 두 번째 인자로 빈 배열이 전달되었기 때문에 componentDidUpdate의 역할은 하지 않음.

  // rendering
  return (
    <>
      {init ? <AppRouter userObj = {userObj} /> : "Initializing..." }
      <footer>&copy; {new Date().getFullYear()} Gwitter</footer>
    </>
  );
}

export default App;