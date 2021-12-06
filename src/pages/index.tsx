import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { TriggerConfig } from 'react-hook-form';
import PagesManifestPlugin from 'next/dist/build/webpack/plugins/pages-manifest-plugin';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  id: string;
  title: string;
  description: string;
  ts: number;
  url: string;
}

interface GetImage {
  after: string;
  data: Image[];
}

export default function Home(): JSX.Element {
  async function fetchImages({ pageParams = null }: any): Promise<GetImage> {
    const { data } = await api('/api/images', {
      params: {
        after: pageParams,
      },
    });

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage?.after || null,
  });

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(image => {
      return image.data.flat();
    });

    return formatted;
  }, [data]);

  if (isLoading && !isError) return <Loading />;
  if (isLoading && isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
