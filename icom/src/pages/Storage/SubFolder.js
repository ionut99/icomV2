import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getFolderByID, getChildFolders } from "../../services/folder";

function SubFolder({ folder }) {
  const [childList, setChildList] = useState([]);
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  useEffect(() => {
    // get childFolderList from Data Base
    return getChildFolders(folder.folderId, user.userId)
      .then((result) => {
        const orderList = result.data["userFolderList"].sort(function (a, b) {
          return new Date(b.createdTime) - new Date(a.createdTime);
        });

        setChildList(orderList);
      })
      .catch(() => {
        console.log("error fetch child folders");
      });
  }, [folder, user.userId]);

  return (
    <div>
      <div>{`  ${folder.Name}`}</div>
      {childList.length > 0 && (
        <div className="folder-list">
          {childList.map((childList, index) => (
            <div key={index}>
              <SubFolder folder={childList} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubFolder;
