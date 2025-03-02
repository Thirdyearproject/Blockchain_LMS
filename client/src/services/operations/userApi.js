import { apiConnector } from "../apiConnector";
import { GET_USER_DETAILS_API } from "../apis";

export async function getUserDetails(token) {
  let result = null;
  try {
    const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch User Details");
    }
    console.log(response.data);
    result = response?.data?.data;
  } catch (err) {
    console.log("Fetching user details Error", err);
  }
  return result;
}
