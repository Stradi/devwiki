import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { API } from "@/types/api";
import { api as ApiMiddleware } from "@/lib/middleware";

const handleGET = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.GetAllWikis> => {
  return new Promise(async (resolve, reject) => {
    try {
      const wikis = await prisma.wiki.findMany();

      const responseJson = {
        data: wikis
      } as API.Responses.GetAllWikis;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json(err);
      reject(err);
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
          pages: {
            create: {
              name: "Index",
              slug: "index"
            }
          }
        }
      });
      
      const responseJson = {
        data: wiki
      } as API.Responses.CreateNewWiki;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json(err);
      reject(err);
    }
  });
}

const handler = ApiMiddleware()
  .get((req: NextApiRequest, res: NextApiResponse) => {
    handleGET(req, res);
  })
  .post((req: NextApiRequest, res: NextApiResponse) => {
    handlePOST(req, res);
  });

export default handler;