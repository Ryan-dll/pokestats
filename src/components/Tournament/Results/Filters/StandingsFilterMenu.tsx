import {
  Box,
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
  Tag,
  Text,
} from '@chakra-ui/react';
import { memo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
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
          <MenuList minWidth='240px' marginRight='0.5'>
            <MenuOptionGroup title='Results'>
              <MenuItemOption
                padding={0}
                value='justDay2'
                isChecked={getFilter('justDay2')}
                onClick={() => toggleFilter('justDay2')}
              >
                Only Day 2
              </MenuItemOption>
            </MenuOptionGroup>
            <MenuDivider />
            <MenuOptionGroup title='Archetype'>
              <Grid gridTemplateColumns={`1fr 1fr`} gap={2} paddingX={2}>
                {supertypeCollection?.map(
                  (supertype, idx) =>
                    supertype.decks.length > 1 && (
                      <Tag variant={'outline'} key={idx}>
                        <MenuItemOption
                          background={'none'}
                          height='100%'
                          alignItems={'center'}
                          padding={'0.25rem 0'}
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
                          <HStack spacing={1}>
                            <SpriteDisplay
                              squishWidth
                              pokemonNames={[supertype.definedPokemon]}
                            />
                            <Text as='b'>{supertype.archetypeName}</Text>
                          </HStack>
                        </MenuItemOption>
                      </Tag>
                    )
                )}
              </Grid>
            </MenuOptionGroup>

            <MenuOptionGroup title='Individual deck'>
              <Grid
                key={`supertype-collection-grid`}
                gridTemplateColumns={`1fr repeat(3, 1fr)`}
              >
                {mostPopularDecks?.map(({ id, name, defined_pokemon }) => (
                  <MenuItemOption
                    padding={0}
                    isChecked={getFilter('decksVisible', [id])}
                    onClick={() =>
                      toggleFilter('decksVisible', { individualDeck: id })
                    }
                    key={name}
                    value={name}
                  >
                    <SpriteDisplay squishWidth pokemonNames={defined_pokemon} />
                  </MenuItemOption>
                ))}
              </Grid>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </StackItem>
    );
  }
);

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
