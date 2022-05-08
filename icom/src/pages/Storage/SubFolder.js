import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import * as BiIcons from "react-icons/bi";

import { getChildFolders } from "../../services/folder";
import { getFileList } from "../../services/file";
import { handleReturnFileIcon } from "./FileIcons";

function SubFolder({ currentFolder }) {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  const [viewSubFolderButton, setviewSubFolderButton] = useState(true);

  const [childFolders, setchildFolders] = useState([]);
  const [childFiles, setchildFiles] = useState([]);

  useEffect(() => {
    let isMounted = true;
    return getChildFolders(currentFolder.folderId, user.userId)
      .then((result) => {
        const orderList = result.data["userFolderList"].sort(function (a, b) {
          return new Date(b.createdTime) - new Date(a.createdTime);
        });

        if (isMounted) setchildFolders(orderList);
        return () => {
          isMounted = false;
        };
      })
      .catch(() => {
        console.log("Error fetch child folders for folder tree!");
      });
  }, [currentFolder.folderId, user.userId]);

  useEffect(() => {
    let isMounted = true;
    return getFileList(currentFolder.folderId, user.userId)
      .then((result) => {
        const orderList = result.data["userFileList"].sort(function (a, b) {
          return new Date(b.createdTime) - new Date(a.createdTime);
        });
        if (isMounted) setchildFiles(orderList);
        return () => {
          isMounted = false;
        };
      })
      .catch(() => {
        console.log("error fetch child folders");
      });
  }, [currentFolder.folderId, user.userId]);

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
                  pathname:
                    currentFolder.folderId !== "root"
                      ? `/storage/folder/${currentFolder.folderId}`
                      : "/storage",
                },
              }}
              className={
                !viewSubFolderButton
                  ? "folder-tree-main-folder-name"
                  : "folder-tree-main-folder-name folder-open"
              }
            >
              <FontAwesomeIcon
                icon={faFolder}
                size="sm"
                style={{
                  marginRight: "10px",
                  color: " #F8D775",
                }}
              />
              {currentFolder.Name}
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>

      <div
        className="folder-list"
        style={{
          display: !viewSubFolderButton ? "none" : "block",
        }}
      >
        {childFolders.length > 0 &&
          childFolders.map((childFolder, index) => (
            <div key={index}>
              <SubFolder currentFolder={childFolder} />
            </div>
          ))}
        {childFiles.length > 0 &&
          childFiles.map((childFile, index) => (
            <div key={index} className="folder-tree-file-element">
              <div className="folder-tree-main-file-name">
                <FontAwesomeIcon
                  icon={handleReturnFileIcon(childFile.type)}
                  size="sm"
                  style={{
                    marginRight: "10px",
                    color: "#198754",
                  }}
                />
                {childFile.fileName}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SubFolder;
