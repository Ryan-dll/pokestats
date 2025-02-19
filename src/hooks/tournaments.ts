import { useQueries, useQuery } from '@tanstack/react-query';
import {
  addDays,
  differenceInHours,
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { useState } from 'react';
import { Tournament, TournamentStatus } from '../../types/tournament';
import { tournamentHasArrivedButNotLive } from '../components/TournamentList/helpers';
import { patchTournamentsClient } from '../lib/patches';
import {
  reallyShortenTournamentName,
  shortenTournamentName,
} from '../lib/tournament';

interface FetchTournamentsOptions {
  prefetch?: boolean;
  onlyFinished?: boolean;
  excludeUpcoming?: boolean;
  tournamentId?: string;
}

export const getTournamentSubStatus = (tournament: Tournament) => {
  const afterDayOne =
    tournament.lastUpdated &&
    tournament.roundNumbers.masters === 9 &&
    differenceInHours(new Date(tournament.lastUpdated), new Date()) >= 1;

  return afterDayOne ? 'after-day-one' : null;
};

export const fetchTournaments = async (options?: FetchTournamentsOptions) => {
  const url = options?.prefetch
    ? 'https://pokedata.ovh/standings/tournaments.json'
    : '/api/tournaments';

  const res: Response = await fetch(url);
  let data: Tournament[] = await res.json();
  data = data.map(tournament => ({
    ...tournament,
    name: shortenTournamentName(tournament),
  }));

  if (options?.onlyFinished) {
    data = data.filter(
      tournament => tournament.tournamentStatus === 'finished'
    );
  }

  data = data.filter(
    tournament =>
      tournament.date.start &&
      isAfter(parseISO(tournament.date.start), parseISO('2022-05-09'))
  );

  if (options?.excludeUpcoming) {
    data = data.filter(
      tournament =>
        tournament.tournamentStatus !== 'not-started' &&
        // something's wrong with tournament 0000019 i guess
        tournament.id !== '0000019'
    );
  }

  if (options?.tournamentId) {
    data = data.filter(tournament => tournament.id === options.tournamentId);
  }

  // Add "after day one" tournament status
  data = data.map(tournament => {
    return {
      ...tournament,
      subStatus: getTournamentSubStatus(tournament),
    };
  });

  return data.slice().reverse();
};

export const useTournaments = (options?: FetchTournamentsOptions) => {
  const queryKey = ['tournaments'];
  if (options?.tournamentId) queryKey.push(options.tournamentId);

  return useQuery({
    queryKey,
    queryFn: () => fetchTournaments(options),
  });
};

export const getTournamentsThatNeedToBePatched = (
  tournamentList: Tournament[]
) =>
  tournamentList.filter(tournament => {
    return isWithinInterval(new Date(), {
      start: addDays(parseISO(tournament.date.start), -1),
      end: addDays(parseISO(tournament.date.end), 1),
    });
  });

export const usePatchedTournaments = (tournamentList: Tournament[]) => {
  const results = useQueries({
    queries: getTournamentsThatNeedToBePatched(tournamentList).map(
      tournament => ({
        queryKey: ['patched-tournament', tournament.id],
        queryFn: () => {
          return patchTournamentsClient(tournament);
        },
      })
    ),
  });

  const tournamentsWithPatchesApplied = tournamentList.map(
    tournament =>
      results.find(
        patchedTournament => tournament.id === patchedTournament.data?.id
      )?.data ?? tournament
  );

  return {
    data: tournamentsWithPatchesApplied,
    isLoading: results.reduce((acc, curr) => acc || curr.isLoading, false),
  };
};

export const getMostRecentFinishedTournament = (tournaments: Tournament[]) =>
  tournaments.find(
    ({ tournamentStatus }) => tournamentStatus === 'finished'
  ) as Tournament;
