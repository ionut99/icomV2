import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";

import ControlPanel from "./pages/ControlPanel/ControlPanel";
import Storage from "./pages/Storage/Storage";
import TextEditor from "./pages/TextEditor/TextEditor";
import Dashboard from "./pages/Dashboard/Dashboard";
import VideoRoom from "./pages/VideoRoom/VideoRoom";
import ChatWindow from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
//
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import { verifyTokenAsync } from "./asyncActions/authAsyncActions";
import "./index.css";

function App() {
  const authObj = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { authLoading, isAuthenticated } = authObj;

  // verify token on app load
  useEffect(() => {
    dispatch(verifyTokenAsync());
  }, [dispatch]);

  // checking authentication
  if (authLoading) {
    return <div className="content">Checking Authentication...</div>;
  }

  return (
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
  );
}

export default App;
