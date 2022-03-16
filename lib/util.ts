import { API } from "@/types/api";

const getHost = () => {
  if(process.env.NODE_ENV === "production") {
    return `https://${ process.env.BASE_DOMAIN }`;
  } else {
    return "http://localhost:3000";
  }
}

const fetchAPI = async <T = API.Responses.Base, Q = API.Requests.Body>(route: string, method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: Q): Promise<T> => {
  const response = await fetch(`${ getHost() }/api${ route }`, {
    method: method || "GET",
    body: JSON.stringify(body) || undefined,
    headers: {
      "Content-Type": "application/json"
    }
  });

  const json = (await response.json() as T);
  return json;
}

export {
  getHost,
  fetchAPI
}