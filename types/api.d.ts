import { Wiki as WikiType, Page as PageType, Page } from "@prisma/client"
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
  
    type CreateNewWiki = GetSingleWiki;
    type DeleteSingleWiki = GetSingleWiki;
    type UpdateSingleWiki = GetSingleWiki;

    type GetAllPages = Base & {
      data: Page[];
    }

    type GetSinglePage = Base & {
      data: Page;
    }

    type CreateNewPage = GetSinglePage;
    type DeleteSinglePage = GetSinglePage;
    type UpdateSinglePage = GetSinglePage;
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

    type CreateNewPageBody = {
      name: string;
      slug: string;
      source?: string;
    }

    type UpdateSinglePageBody = {
      name?: string;
      slug?: string;
      source?: string;
    }

    interface CreateNewWiki extends Base {
      body: CreateNewWikiBody;
    }

    interface UpdateSingleWiki extends Base {
      body: UpdateSingleWikiBody;
    }

    interface CreateNewPage extends Base {
      body: CreateNewPageBody;
    }

    interface UpdateSinglePage extends Base {
      body: UpdateSinglePageBody;
    }
  }
}