import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import prisma from "@/lib/prisma";

interface WikiHomeProps {
  data: string;
}

const WikiHome: NextPage<WikiHomeProps> = (props) => {
  const router = useRouter();
  if(router.isFallback) {
    return (
      <>Fallback</>
    )
  }

  const data = JSON.parse(props.data);
  return (
    <>Welcome to { data.name }.</>
  )
}

export default WikiHome;

export const getStaticPaths: GetStaticPaths = async () => {
  const wikis = await prisma.wiki.findMany();

  return {
    paths: wikis.map(currentWiki => {
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