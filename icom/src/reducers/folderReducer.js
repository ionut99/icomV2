import { useReducer, useEffect } from "react";
import { useSelector } from "react-redux";

import { getFolderByID, getChildFolders } from "../services/folder";
import { getFileList } from "../services/file";

// import { GetFolder } from "../asyncActions/folderAsyncActions";

export const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folders",
  ADD_CHILD_FOLDER: "add-child-folder",
  SET_CHILD_FILES: "add-child-files",
};

export const ROOT_FOLDER = { Name: "My Drive", folderId: "root", path: [] };

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    case ACTIONS.ADD_CHILD_FOLDER:
      return {
        ...state,
        childFolders: [
          ...state.childFolders,
          {
            folderID: payload.folderID,
            name: payload.name,
            parentId: payload.parentId,
            userId: payload.userId,
            path: payload.path,
            createdAt: payload.createdAt,
          },
        ],
      };
    default:
      return state;
  }
}

export function useFolder(folderId = "root", folder = null) {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
  }, [folderId, folder]);

  // get folder details
  useEffect(() => {
    if (folderId === "root") {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    getFolderByID(folderId, user.userId)
      .then((result) => {
        const formattedDoc = {
          Name: result.data["folderObject"][0].Name,
          createdTime: result.data["folderObject"][0].createdTime,
          folderId: result.data["folderObject"][0].folderId,
          parentID: result.data["folderObject"][0].parentID,
          path: JSON.parse(result.data["folderObject"][0].path),
          userID: result.data["folderObject"][0].userID,
        };
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: formattedDoc },
        });
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER },
        });
      });
  }, [folderId, user.userId]);

  // get childFolderList from Data Base
  useEffect(() => {
    let isMounted = true;
    return getChildFolders(folderId, user.userId)
      .then((result) => {
        const orderList = result.data["userFolderList"].sort(function (a, b) {
          return new Date(b.createdTime) - new Date(a.createdTime);
        });

        // console.log(result.data["folderList"]);
        // console.log(orderList);
        if (isMounted)
          dispatch({
            type: ACTIONS.SET_CHILD_FOLDERS,
            payload: { childFolders: orderList },
          });
        return () => {
          isMounted = false;
        };
      })

      .catch(() => {
        console.log("error fetch child folders");
      });
  }, [folderId, user.userId]);

  // get FileList from Data Base
  useEffect(() => {
    let isMounted = true;
    return getFileList(folderId, user.userId)
      .then((result) => {
        const orderList = result.data["userFileList"].sort(function (a, b) {
          return new Date(b.createdTime) - new Date(a.createdTime);
        });
        if (isMounted)
          dispatch({
            type: ACTIONS.SET_CHILD_FILES,
            payload: { childFiles: orderList },
          });
        return () => {
          isMounted = false;
        };
      })
      .catch(() => {
        console.log("error fetch child folders");
      });
  }, [folderId, user.userId]);

  return state;
}
