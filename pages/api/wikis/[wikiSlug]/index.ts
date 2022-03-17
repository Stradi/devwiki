import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { API } from "@/types/api";
import { api as ApiMiddleware } from "@/lib/middleware";

const handleGET = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.GetSingleWiki> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { wikiSlug } = (req.query as { wikiSlug: string });
      const wiki = await prisma.wiki.findUnique({
        where: {
          slug: wikiSlug
        }
      });
  
      const responseJson = {
        data: wiki
      } as API.Responses.GetSingleWiki;
      
      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json(err);
      reject(err);
    }
  })
}

const handleDELETE = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.DeleteSingleWiki> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { wikiSlug } = (req.query as { wikiSlug: string });
      const wiki = await prisma.wiki.delete({
        where: {
          slug: wikiSlug
        }
      });

      const responseJson = {
        data: wiki
      } as API.Responses.DeleteSingleWiki;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json(err);
      reject(err);
    }
  });
}

const handleUPDATE = (req: API.Requests.UpdateSingleWiki, res: NextApiResponse): Promise<API.Responses.UpdateSingleWiki> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { wikiSlug } = (req.query as { wikiSlug: string });
      const wiki = await prisma.wiki.update({
        where: {
          slug: wikiSlug
        }, data: {
          name: req.body.name || undefined,
          slug: req.body.slug || undefined,
          description: req.body.description || undefined
        }
      });

      const responseJson = {
        data: wiki
      } as API.Responses.UpdateSingleWiki;

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
  .delete((req: NextApiRequest, res: NextApiResponse) => {
    handleDELETE(req, res);
  })
  .patch((req: NextApiRequest, res: NextApiResponse) => {
    handleUPDATE(req, res);
  })
  .put((req: NextApiRequest, res: NextApiResponse) => {
    handleUPDATE(req, res);
  });

export default handler;