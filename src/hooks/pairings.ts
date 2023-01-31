import { useQuery } from '@tanstack/react-query';
import { Pairing } from '../../types/pairings';
import supabase from '../lib/supabase/client';

export const fetchPairingSubmissions = async (tournamentId: string) => {
  const res = await supabase
    .from('Pairing Submissions')
    .select(
      `id,deck_archetype,player1_name,player2_name,user_who_submitted,table_number,round_number`
    )
    .eq('tournament_id', tournamentId);
  return res.data;
};

export const usePairingSubmissions = (tournamentId: string) => {
  return useQuery({
    queryKey: ['pairings'],
    queryFn: () => fetchPairingSubmissions(tournamentId),
  });
};

export interface FetchPairingsOptions {
  prefetch?: boolean;
  roundNumber?: number;
}

interface PairingsSchema {
  tables: Pairing[];
}

interface FetchPairingsSchema {
  round: number;
  tables?: Pairing[];
}

export const fetchPairings = async (
  tournamentId: string,
  options?: FetchPairingsOptions
): Promise<FetchPairingsSchema> => {
  const slug = `standings/${tournamentId}/masters/${tournamentId}_Masterstables.json`;
  const url = `${
    options?.prefetch ? 'https://pokedata.ovh' : '/pokedata'
  }/${slug}`;

  const res: Response = await fetch(url);
  const data: PairingsSchema[] = await res.json();

  if (options?.roundNumber) {
    return {
      round: options.roundNumber,
      tables: data.at(options.roundNumber)?.tables,
    };
  }

  return {
    round: data.length - 1,
    tables: data.at(data.length - 1)?.tables,
  };
};

export const usePairings = (
  tournamentId: string,
  options?: FetchPairingsOptions
) => {
  return useQuery({
    queryKey: ['pairings', tournamentId],
    queryFn: () => fetchPairings(tournamentId, options),
  });
};
