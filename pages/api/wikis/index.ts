import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { API } from "@/types/api";

const handleGET = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.GetAllWikis> => {
  return new Promise(async (resolve, reject) => {
    try {
      const wikis = await prisma.wiki.findMany()
      const responseJson = {
        data: wikis
      } as API.Responses.GetAllWikis;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      reject({
        errorCode: -1,
        errorMsg: "Error querying database"
      });
    }
  });
}

const handlePOST = (req: API.Requests.CreateNewWiki, res: NextApiResponse): Promise<API.Responses.CreateNewWiki> => {
  return new Promise(async (resolve, reject) => {
    try {
      const wiki = await prisma.wiki.create({
        data: {
          name: req.body.name,
          slug: req.body.slug,
          description: req.body.description || undefined,
        }
      });
      const responseJson = {
        data: wiki
      } as API.Responses.CreateNewWiki;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err: any) {
      reject({
        errorCode: -1,
        errorMsg: "Unknown database error"
      });
    }
  });
}

const handler = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.Base> => {
  if(req.method === "GET") {
    return handleGET(req, res);
  } else if(req.method === "POST") {
    return handlePOST(req, res);
  } else {
    return Promise.resolve({
      errorCode: -1,
      errorMsg: "Invalid request method"
    });
  }
}

export default handler;