import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { API } from "@/types/api";
import { api as ApiMiddleware } from "@/lib/middleware";

const handleGET = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.GetAllPages> => {
  return new Promise(async (resolve, reject) => {
    const { wikiSlug } = (req.query as { wikiSlug: string });
    try {
      const pages = await prisma.page.findMany({
        where: {
          wikiSlug
        }
      });
      
      const responseJson = {
        data: pages
      } as API.Responses.GetAllPages;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json(err);
      reject(err);
    }
  });
}

const handlePOST = (req: API.Requests.CreateNewPage, res: NextApiResponse): Promise<API.Responses.CreateNewPage> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { wikiSlug } = (req.query as { wikiSlug: string });
      const page = await prisma.page.create({
        data: {
          name: req.body.name,
          slug: req.body.slug,
          source: req.body.source,
          wiki: {
            connect: {
              slug: wikiSlug
            }
          }
        }
      });

      const responseJson = {
        data: page
      } as API.Responses.CreateNewPage;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json({});
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