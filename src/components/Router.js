import React from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

// App.js에서 로그인 여부와 user 정보를 전달해줌. 근데 user가 null이면 로그인이 안 됐다는 건데 굳이 isLoggedIn이 필요한가 -> 그래서 지움
const AppRouter = ({ userObj }) => {
    return (
        <Router>
            {userObj && <Navigation /> } {/* isLoggedIn이 true일 때만 Navigation 실행 */}
            <Switch>
                {userObj ? ( // 로그인이 되어 있으면 Home, Profile
                    <>  
                        <Route exact path = '/'>
                            <Home userObj = {userObj} /> {/* user의 정보를 Home으로 전달 */}
                        </Route>
                        <Route exact path = '/profile'>
                            <Profile />
                        </Route>
                    </>
                ) : ( // 안 되어 있으면 Auth
                    <>
                        <Route exact path = '/' >
                            <Auth />
                        </Route>
                    </>
                )}
            </Switch>
        </Router>
    )
}

export default AppRouter;