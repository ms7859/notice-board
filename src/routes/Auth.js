import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

/*
Promise를 반환하면 await가 필요한듯? ex) authService.createUserWithEmailAndPassword, authService.signInWithEmailAndPassword
*/

// 로그인이 안 되어 있을 때 로그인창을 띄움
const Auth = () => {
    const [email, setEmail] = useState("");             // input에 입력된 email을 저장하기 위한 state
    const [password, setPassword] = useState("");       // input에 입력된 passwor을 저장하기 위한 password
    const [newAccount, setNewAccount] = useState(false); // true: 계정생성, false: 로그인. toggleAccount에 의해 toggle됨
    const [error, setError] = useState("");

    // form의 input에 입력된 값이 바뀔 때마다 호출. input에 값을 입력하면 email과 password는 실시간으로 수정됨.
    const onChange = (event) => {
        const {
            target: {name, value}
        } = event;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    
    // 이메일과 비밀번호가 submit 될 때 호출
    const onSubmit = async (event) => {
        event.preventDefault();

        // submit을 누를 때 email과 password에는 onChange 함수에 의해 이미 사용자가 입력한 값이 저장되어어 있음.
        try {
            if (newAccount) {
                await authService.createUserWithEmailAndPassword(email, password); // 새로운 계정 생성 후 로그인
            } else {
                await authService.signInWithEmailAndPassword(email, password); // 로그인
            }
        } catch(error) {
            setError(error.message);
        } 
    };

    // 계정 만들기와 로그인을 toggle하기 위한 함수. Sign in 또는 Create Account를 누르면 호출
    const toggleAccount = () => setNewAccount(prev => !prev);

    // Continue with google/github가 클릭되면 호출
    const onSocialClick = async (event) => {
        const {
            target:{name},
        } = event;

        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }

        await authService.signInWithPopup(provider);
    };

    // rendering
    return (
        <div>
            <form onSubmit = {onSubmit}>
                <input
                    name = "email" 
                    type = "email" 
                    placeholder = "Email" 
                    required 
                    value = {email}
                    onChange={onChange}
                />
                <input 
                    name = "password"
                    type = "password"
                    placeholder = "Password"
                    required
                    value = {password}
                    onChange={onChange}
                />
                <input type = "submit" value = {newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>

            <span onClick={toggleAccount}>
                {newAccount ? "Sign in" : "Create Account"}
            </span>

            <div>
                <button onClick = {onSocialClick} name = "google">
                    Continue with Google
                </button>
                <button onClick = {onSocialClick} name = "github">
                    Continue with Github
                </button>
            </div>
        </div>
    );
};

export default Auth;

