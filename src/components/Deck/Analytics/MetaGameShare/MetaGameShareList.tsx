import { memo } from 'react';
import { Grid } from '@chakra-ui/react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { IndividualShareCard } from './IndividualShareCard';
import { getMetaDiff } from './helpers';

export const MetaGameShareList = memo(
  ({
    tournamentRange,
    sortByMoves,
    preview,
  }: {
    tournamentRange: number[];
    sortByMoves?: boolean;
    preview?: boolean;
  }) => {
    let decks = useStoredDecks({ tournamentRange });
    const previousDecks = useStoredDecks({
      tournamentRange: [tournamentRange[0] - 1, tournamentRange[1] - 1],
    });

    if (sortByMoves) {
      decks = decks.sort((a, b) => {
        const firstMetaDiff = Math.abs(
          getMetaDiff(
            { ...a.deck, count: a.count },
            decks,
            previousDecks
          ) as number
        );
        const secondMetaDiff = Math.abs(
          getMetaDiff(
            { ...b.deck, count: b.count },
            decks,
            previousDecks
          ) as number
        );

        if (firstMetaDiff > secondMetaDiff) return -1;
        if (firstMetaDiff < secondMetaDiff) return 1;
        return 0;
      });
    }

    return (
      <Grid gridTemplateColumns={'1fr 1fr'}>
        {decks.slice(0, preview ? 4 : undefined).map(({ deck, count }) => {
          return (
            deck?.id && (
              <IndividualShareCard
                deck={deck}
                count={count}
                tournamentRange={tournamentRange}
              />
            )
          );
        })}
      </Grid>
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
