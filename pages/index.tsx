import { dehydrate, QueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { TournamentList } from '../src/components/TournamentList/TournamentList';
import { fetchPokedex } from '../src/hooks/images';
import { fetchSets } from '../src/hooks/sets';
import { fetchTournaments } from '../src/hooks/tournaments';
import styles from '../styles/Home.module.css';
import { Tournament } from '../types/tournament';

export default function Home({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokestats Live</title>
        <meta name='description' content='Pokestats' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <TournamentList tournaments={tournaments} />
    </div>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);
  await queryClient.prefetchQuery([`sets`], fetchSets);

  return {
    props: { tournaments, dehydratedState: dehydrate(queryClient) },
  };
}
