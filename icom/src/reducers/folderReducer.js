import { useReducer, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getFolderByID } from "../services/folder";

import { GetFolder } from "../asyncActions/folderAsyncActions";

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
};

const ROOT_FOLDER = { name: "Root", id: null, path: [] };

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
        console.log("folderul este: ");
        console.log(result.data["folderObject"][0]);

        const formattedDoc = {
          id: result.data["folderObject"][0].folderID,
          ...result.data["folderObject"][0],
        };

        console.log(formattedDoc);

      })
      .catch(() => {
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER },
        });
      });

    // console.log("mama");
    // return dispatch(GetFolder(folderId, user.userId));
  }, [folderId]);

  return state;
}
