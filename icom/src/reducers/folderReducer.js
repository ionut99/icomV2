import { useReducer, useEffect } from "react";
import { useSelector } from "react-redux";

import { getFolderByID, getChildFolders } from "../services/folder";

// import { GetFolder } from "../asyncActions/folderAsyncActions";

export const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folders",
  ADD_CHILD_FOLDER: "add-child-folder",
};

export const ROOT_FOLDER = { Name: "Root", folderId: null, path: [] };

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

export function useFolder(folderId = null, folder = null) {
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

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    // Get Folder from database by ID

    getFolderByID(folderId, user.userId)
      .then((result) => {
        // console.log(result.data["folderObject"][0]);
        const formattedDoc = {
          Name: result.data["folderObject"][0].Name,
          createdTime: result.data["folderObject"][0].createdTime,
          folderId: result.data["folderObject"][0].folderId,
          parentID: result.data["folderObject"][0].parentID,
          path: JSON.parse(result.data["folderObject"][0].path),
          userID: result.data["folderObject"][0].userID,
        };
        // console.log(formattedDoc);
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

    // console.log("mama");
    // return dispatch(GetFolder(folderId, user.userId));
  }, [folderId, user.userId]);

  useEffect(() => {
    // get childFolderList from Data Base
    return getChildFolders(folderId, user.userId)
      .then((result) => {
        // console.log("child folders: ");

        const orderList = result.data["folderList"].sort(function (a, b) {
          return new Date(b.createdTime) - new Date(a.createdTime);
        });

        // console.log(result.data["folderList"]);
        // console.log(orderList);

        dispatch({
          type: ACTIONS.SET_CHILD_FOLDERS,
          payload: { childFolders: orderList },
        });
      })
      .catch(() => {
        console.log("error fetch child folders");
      });
  }, [folderId, user.userId]);

  return state;
}
