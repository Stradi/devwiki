import { Wiki as WikiType } from "@prisma/client"
import { NextApiRequest } from "next";

declare namespace API {
  declare namespace Responses {
    type Base = {
      errorCode: number | undefined;
      errorMsg: string | undefined;
    }
  
    type GetAllWikis = Base & {
      data: WikiType[];
    }
  
    type GetSingleWiki = Base & {
      data: WikiType;
    }
  
    type DeleteSingleWiki = GetSingleWiki;

    type UpdateSingleWiki = GetSingleWiki;

    type CreateNewWiki = BaseAPI & {
      data: WikiType;
    }
  }

  declare namespace Requests {
    type Base = NextApiRequest;
    type Body = CreateNewWikiBody | UpdateSingleWikiBody;

    type CreateNewWikiBody = {
      name: string;
      slug: string;
      description?: string;
    }

    type UpdateSingleWikiBody = {
      name?: string;
      slug?: string;
      description?: string;
    }


    interface CreateNewWiki extends Base {
      body: CreateNewWikiBody
    }

    interface UpdateSingleWiki extends Base {
      body: UpdateSingleWikiBody
    }
  }
}