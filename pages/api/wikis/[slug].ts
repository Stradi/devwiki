import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { API } from "@/types/api";

const handleGET = (req: NextApiRequest, res: NextApiResponse, slug: string): Promise<API.Responses.GetSingleWiki> => {
  return new Promise(async (resolve, reject) => {
    try {
      const wiki = await prisma.wiki.findUnique({
        where: {
          slug
        }
      });
  
      const responseJson = {
        data: wiki
      } as API.Responses.GetSingleWiki;
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

const handleDELETE = (req: NextApiRequest, res: NextApiResponse, slug: string): Promise<API.Responses.DeleteSingleWiki> => {
  return new Promise(async (resolve, reject) => {
    try {
      const wiki = await prisma.wiki.delete({
        where: {
          slug
        }
      });

      const responseJson = {
        data: wiki
      } as API.Responses.DeleteSingleWiki;
      res.status(200).json(responseJson);
      resolve(responseJson);
    } catch(err) {
      reject({
        errorCode: -1,
        errorMsg: "Error deleting record"
      });
    }
  });
}

const handleUPDATE = (req: API.Requests.UpdateSingleWiki, res: NextApiResponse, slug: string): Promise<API.Responses.UpdateSingleWiki> => {
  return new Promise(async (resolve, reject) => {
    try {
      const wiki = await prisma.wiki.update({
        where: {
          slug
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
    } catch(err: any) {
      reject({
        errorCode: -1,
        errorMsg: "Unknown database error"
      });
    }
  });
}

const handler = (req: NextApiRequest, res: NextApiResponse): Promise<API.Responses.Base> => {
  const { slug } = (req.query as { slug: string });
  if(req.method === "GET") {
    return handleGET(req, res, slug);
  } else if(req.method === "DELETE") {
    return handleDELETE(req, res, slug);
  } else if(req.method === "PUT" || req.method === "PATCH") { 
    return handleUPDATE(req, res, slug);    
  } else {
    return Promise.resolve({
      errorCode: -1,
      errorMsg: "Invalid request method"
    });
  }
}

export default handler;