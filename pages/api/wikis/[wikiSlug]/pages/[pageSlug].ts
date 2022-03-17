import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { API } from "@/types/api";
import { api as ApiMiddleware } from "@/lib/middleware";

const handleGET = async (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.GetSinglePage> => {
  return new Promise(async (resolve, reject) => {
    const { wikiSlug, pageSlug } = (req.query as { wikiSlug: string, pageSlug: string });
    try {
      const page = await prisma.page.findUnique({
        where: {
          pageIdentifier: {
            wikiSlug,
            slug: pageSlug
          }
        }
      });

      const responseJson = {
        data: page
      } as API.Responses.GetSinglePage;
      
      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json(err);
      reject(err);
    }
  });
}

const handleDELETE = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.DeleteSinglePage> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { wikiSlug, pageSlug } = (req.query as { wikiSlug: string, pageSlug: string });
      const page = await prisma.page.delete({
        where: {
          pageIdentifier: {
            wikiSlug,
            slug: pageSlug
          }
        }
      });

      const responseJson = {
        data: page
      } as API.Responses.DeleteSinglePage;

      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      res.status(500).json(err);
      reject(err);
    }
  })
}

const handleUPDATE = (req: API.Requests.UpdateSinglePage, res: NextApiResponse): Promise<API.Responses.UpdateSinglePage> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { wikiSlug, pageSlug } = (req.query as { wikiSlug: string, pageSlug: string });
      const page = await prisma.page.update({
        where: {
          pageIdentifier: {
            wikiSlug,
            slug: pageSlug
          }
        },
        data: {
          name: req.body.name || undefined,
          slug: req.body.slug || undefined,
          source: req.body.source || undefined
        }
      });

      const responseJson = {
        data: page
      } as API.Responses.UpdateSinglePage;

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