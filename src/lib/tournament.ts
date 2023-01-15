import { getYear, parseISO } from 'date-fns';
import { Tournament } from '../../types/tournament';

export const shortenTournamentName = (tournament: Tournament) => {
  const tournamentStartYear = getYear(parseISO(tournament.date.start));
  const shortName = tournament.name
    .replace('Pokémon TCG', '')
    .replace('TCG', '');

  return `${shortName} ${
    shortName.includes(tournamentStartYear.toString())
      ? ''
      : tournamentStartYear
  }`;
};
