import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getChildFolders } from "../../services/folder";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

// import arrowstructure from "../../images/arrowstructure.svg";
// import menudown from "../../images/menudown.svg";

import * as BiIcons from "react-icons/bi";
import { ROOT_FOLDER } from "../../reducers/folderReducer";

function SubFolder({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  const myPath = eval(currentFolder.path);
  if (currentFolder && typeof myPath !== "string") {
    path = [...path, ...myPath];
  }

  const [viewSubFolderButton, setviewSubFolderButton] = useState(false);
  const [childList, setChildList] = useState([]);
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  useEffect(() => {
    // get childFolderList from Data Base
    if (path.length === 0 && currentFolder.Name !== "My Drive") return;
    return getChildFolders(currentFolder.folderId, user.userId)
      .then((result) => {
        const orderList = result.data["userFolderList"].sort(function (a, b) {
          return new Date(b.createdTime) - new Date(a.createdTime);
        });

        if (orderList.length > 0) {
          setChildList(orderList);
        }
      })
      .catch(() => {
        console.log("error fetch child folders");
      });
  }, [currentFolder, user.userId]);

  return (
    <div className="folder-tree-subfolders">
      <div className="folder-tree-main-folder">
        <div className="folder-tree-image-view">
          <BiIcons.BiRightArrow
            size={18}
            style={{
              display: viewSubFolderButton ? "none" : "block",
            }}
            onClick={() => {
              setviewSubFolderButton(!viewSubFolderButton);
            }}
          />
          <BiIcons.BiDownArrow
            size={18}
            style={{
              display: !viewSubFolderButton ? "none" : "block",
              color: "#0969da",
            }}
            onClick={() => {
              setviewSubFolderButton(!viewSubFolderButton);
            }}
          />
        </div>

        <Breadcrumb
          style={{
            color: !viewSubFolderButton ? "none" : "#0969da",
          }}
        >
          {currentFolder && (
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{
                to: {
                  pathname: currentFolder.folderId
                    ? `/storage/folder/${currentFolder.folderId}`
                    : "/storage",
                  state: { folder: { ...currentFolder, path: path.slice(1) } },
                },
              }}
              className={
                !viewSubFolderButton
                  ? "folder-tree-main-folder-name"
                  : "folder-tree-main-folder-name folder-open"
              }
            >
              {currentFolder.Name}
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>
      {childList.length > 0 && (
        <div
          className="folder-list"
          style={{
            display: !viewSubFolderButton ? "none" : "block",
          }}
        >
          {childList.map((childFolder, index) => (
            <div key={index}>
              <SubFolder currentFolder={childFolder} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubFolder;
