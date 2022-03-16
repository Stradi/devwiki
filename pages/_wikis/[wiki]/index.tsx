import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import prisma from "@/lib/prisma";
import { fetchAPI } from "@/lib/util";
import { API } from "@/types/api";
import { Wiki } from "@prisma/client";

interface WikiHomeProps {
  data: string;
}

const WikiHome: NextPage<WikiHomeProps> = (props) => {
  const router = useRouter();
  if(router.isFallback) {
    return (
      <>Loading...</>
    )
  }

  const data = JSON.parse(props.data) as Wiki;
  return (
    <>
      <h1>Welcome to { data.name }.</h1>
      <p>This wiki is created at { data.createdAt }.</p>
      <p>{ data.description }</p>
    </>
  )
}

export default WikiHome;

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetchAPI<API.Responses.GetAllWikis>("/wikis", "GET");
  
  return {
    paths: response.data.map(currentWiki => {
      return { params: { wiki: currentWiki.slug }}
    }),
    fallback: true
  };
}

interface GetStaticPropsParams extends ParsedUrlQuery {
  wiki: string;
}

export const getStaticProps: GetStaticProps<WikiHomeProps, GetStaticPropsParams> = async (context) => {
  const wikiData = await prisma.wiki.findUnique({
    where: {
      slug: context.params?.wiki
    }
  });

  if(!wikiData) {
    return {
      notFound: true,
      revalidate: 60
    }
  }

  return {
    props: {
      data: JSON.stringify(wikiData)
    },
    revalidate: 600
  }
}