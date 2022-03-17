import { NextApiRequest, NextApiResponse } from "next";

import cors from "cors";
import nextConnect from "next-connect";

const api = () => {
  return nextConnect<NextApiRequest, NextApiResponse>().use(cors());
}

export {
  api
}