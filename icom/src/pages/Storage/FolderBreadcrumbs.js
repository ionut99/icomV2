import React from "react";
import { useSelector } from "react-redux";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../../reducers/folderReducer";

export default function FolderBreadcrumbs({ currentFolder }) {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const userDetails = user.surname + " " + user.name;

  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];

  if (currentFolder && typeof currentFolder.path !== "string") {
    path = [...path, ...currentFolder.path];
  }

  return (
    <Breadcrumb
      className="flex-grow-1"
      listProps={{ className: "bg-white pl-0 m-0" }}
    >
      {path.map((folder, index) => (
        <Breadcrumb.Item
          key={index}
          linkAs={Link}
          linkProps={{
            to: {
              pathname: folder.folderId
                ? `/storage/folder/${folder.folderId}`
                : "/storage",
              state: { folder: { ...folder, path: path.slice(1, index) } },
            },
          }}
          className="text-truncate d-inline-block"
          style={{
            maxWidth: "150px",
            fontSize: "25px",
          }}
        >
          {folder.Name.replace(userDetails, "").replace(" # ", " ")}
        </Breadcrumb.Item>
      ))}
      {currentFolder && (
        <Breadcrumb.Item
          className="text-truncate d-inline-block"
          style={{ maxWidth: "200px", fontSize: "25px" }}
          active
        >
          {currentFolder.Name.replace(userDetails, "").replace(" # ", " ")}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}
