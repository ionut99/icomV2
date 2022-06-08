import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";

import ControlPanel from "./pages/ControlPanel/ControlPanel";
import TextEditor from "./pages/TextEditor/TextEditor";
import Dashboard from "./pages/Dashboard/Dashboard";
import VideoRoom from "./pages/VideoRoom/VideoRoom";
import Storage from "./pages/Storage/Storage";
import ChatWindow from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
//
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
//

import { verifyTokenAsync } from "./asyncActions/authAsyncActions";
import { setAuthToken } from "./services/auth";
import moment from "moment";
import "./index.css";

import { SocketContext, socket } from "./context/socket";

function App() {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { expiredAt, token, authLoading, isAuthenticated } = authObj;

  // verify token on app load
  // useEffect(() => {
  //   dispatch(verifyTokenAsync());
  // }, [dispatch]);
  // dispatch used from when we want to reload the page

  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

  // checking authentication
  if (authLoading) {
    return <div className="content">Checking Authentication...</div>;
  }

  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <BrowserRouter>
          <div className="content">
            <Switch>
              <PublicRoute
                path="/login"
                component={Login}
                isAuthenticated={isAuthenticated}
              />

              {/* <Navbar /> */}
              <PrivateRoute
                path="/dashboard"
                component={Dashboard}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/chat"
                component={ChatWindow}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                exact
                path="/storage"
                component={Storage}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/newdocument/:folderId/:fileId"
                component={TextEditor}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/storage/folder/:folderId"
                component={Storage}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/roomcall/:roomId"
                component={VideoRoom}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                exact
                path="/controlpanel"
                component={ControlPanel}
                isAuthenticated={isAuthenticated}
              />

              <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
