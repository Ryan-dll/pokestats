import {
  Button,
  Grid,
  GridItem,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  StackItem,
  Text,
} from '@chakra-ui/react';
import { memo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { DeckArchetype, Tournament } from '../../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay';
import { sortBySuperType } from './helpers';
import { ToggleFilterOptions } from './StandingsFilterContainer';

export interface Filter {
  name: string;
  value: boolean;
}

export interface StandingsFilters {
  justDay2: Filter;
  decksVisible: number[];
}

export const StandingsFilterMenu = memo(
  ({
    getFilter,
    toggleFilter,
    tournament,
  }: {
    getFilter: (key: keyof StandingsFilters, arg?: any) => boolean;
    toggleFilter: (
      key: keyof StandingsFilters,
      options?: ToggleFilterOptions
    ) => void;
    tournament: Tournament;
  }) => {
    const mostPopularDecks = useMostPopularArchetypes(tournament.id, {
      leaveOutZeroCountDecks: true,
    });

    const supertypeCollection = sortBySuperType(mostPopularDecks);

    return (
      <StackItem>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            colorScheme='gray'
            variant='outline'
            size='sm'
            leftIcon={<FaFilter />}
          >
            Filter
          </MenuButton>
          <MenuList minWidth='240px'>
            <MenuItemOption
              value='justDay2'
              isChecked={getFilter('justDay2')}
              onClick={() => toggleFilter('justDay2')}
            >
              Only Day 2
            </MenuItemOption>
            <MenuDivider />
            <Grid
              key={`supertype-collection-grid`}
              gridTemplateColumns={`1fr repeat(2, 1fr)`}
            >
              {supertypeCollection?.map((supertype, idx) =>
                supertype.decks.length > 1 ? (
                  <Grid
                    gridColumn={'1/4'}
                    key={`supertype-collection-${idx}`}
                    gridTemplateColumns={`repeat(3, 1fr)`}
                  >
                    <GridItem gridRow={'1/10'}>
                      <MenuItemOption
                        height='100%'
                        display='flex'
                        alignItems={'center'}
                        padding={0}
                        isChecked={getFilter(
                          'decksVisible',
                          supertype.decks.map(({ id }) => id)
                        )}
                        onClick={() =>
                          toggleFilter('decksVisible', {
                            superType: supertype.decks,
                          })
                        }
                      >
                        <Text
                          fontSize={'sm'}
                          as='b'
                          color='gray.800'
                          opacity={
                            getFilter(
                              'decksVisible',
                              supertype.decks.map(({ id }) => id)
                            )
                              ? '100%'
                              : '40%'
                          }
                        >
                          {supertype.archetypeName}
                        </Text>
                      </MenuItemOption>
                    </GridItem>
                    {supertype.decks.map(({ id, name, defined_pokemon }) => (
                      <MenuItemOption
                        opacity={
                          getFilter('decksVisible', [id]) ? '100%' : '40%'
                        }
                        isChecked={getFilter('decksVisible', [id])}
                        onClick={() =>
                          toggleFilter('decksVisible', { individualDeck: id })
                        }
                        key={name}
                        value={name}
                      >
                        <SpriteDisplay
                          squishWidth
                          pokemonNames={defined_pokemon}
                        />
                      </MenuItemOption>
                    ))}
                  </Grid>
                ) : (
                  <MenuItemOption
                    opacity={
                      getFilter('decksVisible', [supertype.decks[0].id])
                        ? '100%'
                        : '40%'
                    }
                    isChecked={getFilter('decksVisible', [
                      supertype.decks[0].id,
                    ])}
                    onClick={() =>
                      toggleFilter('decksVisible', {
                        individualDeck: supertype.decks[0].id,
                      })
                    }
                    key={supertype.decks[0].name}
                    value={supertype.decks[0].name}
                  >
                    <SpriteDisplay
                      squishWidth
                      pokemonNames={supertype.decks[0].defined_pokemon}
                    />
                  </MenuItemOption>
                )
              )}
            </Grid>
          </MenuList>
        </Menu>
      </StackItem>
    );
  }
);

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
