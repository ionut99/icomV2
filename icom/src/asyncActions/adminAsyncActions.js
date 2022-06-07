import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import { getUserAdminList, getGroupsNames } from "../services/admin";

//admin search user function
export const getUsersDetailsList = async (search_text, userId) => {
  const result = await getUserAdminList(search_text, userId);

  if (result.status === 200) return result.data["admin_user_list"];
  else return null;
};

export const getGroupsDetails = async (adminId) => {
  const result = await getGroupsNames(adminId);

  if (result.status === 200) return result.data["teams_res"];
  else return null;
};
