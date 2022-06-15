import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSearchRoomService } from "../../services/user";

import Navbar from "../../components/Navbar/Navbar";
import Team from "./Team";
import "./dashboard.css";


function Dashboard() {
  // const dispatch = useDispatch();

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const [teamList, setTeamList] = useState([]);

  //

  // get details about groups
  useEffect(() => {
    let isMounted = true;
    if (user == null) return;

    const getGroupChannels = async (userId) => {
      return await getSearchRoomService("", userId)
        .then((result) => {
          return result.data["search_results"].filter((team) => team.type == 0);
        })
        .catch((err) => {
          console.log("Error fetch teams which user is involved in ...");
          return undefined;
        });
    };

    try {
      getGroupChannels(user.userId)
        .then((result) => {
          if (isMounted && result !== undefined) setTeamList(result);
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      console.error(error);
    }
    //
  }, []);
  //

  return (
    <div className="page">
      <Navbar />
      <div className="home-page">
        <div className="teams-content">
          <div className="teams-list">
            {teamList.map((group, index) => {
              return <Team team={group} key={index} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
