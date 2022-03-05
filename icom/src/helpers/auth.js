import { verifyTokenAsync } from "../asyncActions/authAsyncActions";
import { setAuthToken } from "../services/auth";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";

function RenewToken() {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { expiredAt, token } = authObj;

  setAuthToken(token);
  const verifyTokenTimer = setTimeout(() => {
    dispatch(verifyTokenAsync(true));
  }, moment(expiredAt).diff() - 10 * 1000);
  return () => {
    clearTimeout(verifyTokenTimer);
  };
};

export default RenewToken;
