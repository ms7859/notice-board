import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router";

// 로그인한 상태로 홈페이지에서 profile을 누를 때 profile 페이지 띄움
export default () => {
    // "/profile"에서 로그아웃을 했을 때 "/"으로 이동하기 위한 코드
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut()
        history.push("/");        // 로그아웃하면 /으로 이동
    };

    return (
        <>
            <button onClick = {onLogOutClick}>Log out</button>
        </>
    );
};