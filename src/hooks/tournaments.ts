import { useQuery } from '@tanstack/react-query';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { Tournament } from '../../types/tournament';

export const fetchTournaments = async (options?: {
  prefetch?: boolean;
  onlyFinished?: boolean;
}) => {
  const res: Response = await fetch(
    `${
      options?.prefetch ? 'https://pokedata.ovh' : '/pokedata'
    }/standings/tournaments.json`
  );
  let data: Tournament[] = await res.json();

  data = data.map(tournament => {
    if (isBefore(new Date(), parseISO(tournament.date.start))) {
      return {
        ...tournament,
        tournamentStatus: 'not-started',
      };
    }

    if (isAfter(new Date(), parseISO(tournament.date.start))) {
      return {
        ...tournament,
        tournamentStatus: 'finished',
      };
    }

    return tournament;
  });

  if (options?.onlyFinished) {
    data = data.filter(
      tournament => tournament.tournamentStatus === 'finished'
    );
  }

  return data;
};

export const fetchCurrentTournamentInfo = async (
  tournamentId: string,
  options?: {
    prefetch?: boolean;
  }
) => {
  const tournaments = await fetchTournaments(options);
  const currentTournament = tournaments?.find(({ id }) => id === tournamentId);
  return currentTournament;
};

export const useTournaments = (options?: { prefetch?: boolean }) => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments(options),
  });
};
