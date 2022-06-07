import { getUserAdminList, getGroupsNames } from "../services/admin";
import { getParticipantsListService } from "../services/user";

//admin search user function
export const getUsersDetailsList = async (search_text, userId) => {
  const result = await getUserAdminList(search_text, userId);

  if (result.status === 200) return result.data["admin_user_list"];
  else return undefined;
};

//admin get details about users from a room
export const getRoomUsersDetailsList = async (userId, roomId) => {
  const result = await getParticipantsListService(roomId);

  if (result.status === 200) return result.data["participantsRoomList"];
  else return undefined;
};

export const getGroupsDetails = async (adminId) => {
  const result = await getGroupsNames(adminId);

  if (result.status === 200) return result.data["teams_res"];
  else return undefined;
};
