import { memo, useMemo } from 'react';
import { Button, Heading, HStack, Stack } from '@chakra-ui/react';
import Image from 'next/image';
import { getCardImageUrl } from '../ListViewer/helpers';
import { DeckCard, Deck } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';
import { useFinalResults } from '../../../hooks/finalResults';
import SpriteDisplay from '../../common/SpriteDisplay/SpriteDisplay';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../common/Layout/StickyHeader';
import { DeckVariants } from './DeckVariants';
import { BackToDecksButton } from './BackToDecksButton';

export const DeckHeader = memo(
  ({ deck, compact }: { deck: Deck; compact?: boolean }) => {
    const { data: deckStandings } = useFinalResults(
      deck.classification === 'supertype'
        ? { supertypeId: deck.id }
        : { deckId: deck.id }
    );
    const codeToSetMap = useCodeToSetMap();
    const router = useRouter();

    const identifiableCards = useMemo(
      () =>
        deck.identifiable_cards
          ?.map(cardName => {
            return deckStandings?.[0]?.deck?.list?.pokemon.find(
              ({ name, set }) => {
                // Hard code to get the right Inteleon
                if (
                  name === 'Inteleon' &&
                  deckStandings?.[0].deck?.list?.pokemon.find(
                    ({ name, set }) => name === 'Inteleon' && set === 'SSH'
                  ) &&
                  set !== 'SSH'
                ) {
                  return false;
                }
                return name === cardName;
              }
            );
          })
          .filter(card => card),
      [deck.identifiable_cards, deckStandings]
    );

    const heightWidthRatio = 1.396;
    const width = 125;
    const height = width * heightWidthRatio;

    if (compact) {
      return (
        <StickyHeader id='compact-deck-header'>
          <div>
            <Button
              variant={'ghost'}
              size='sm'
              leftIcon={<FaChevronLeft />}
              onClick={() => router.back()}
              paddingLeft={4}
              justifyContent='start'
            >
              <HStack>
                <Heading color='gray.700' size='md' letterSpacing={'wide'}>
                  {deck.name}
                </Heading>
                <SpriteDisplay pokemonNames={deck.defined_pokemon} />
              </HStack>
            </Button>
          </div>
        </StickyHeader>
      );
    }

    return (
      <Stack paddingX={8}>
        <BackToDecksButton />
        <HStack spacing={0}>
          {identifiableCards?.map(card => (
            <Image
              key={`${card?.name} ${card?.set}`}
              width={width}
              height={height}
              src={getCardImageUrl(card as DeckCard, codeToSetMap, {
                highRes: true,
              })}
              alt={`${card?.name} ${card?.set}`}
            />
          ))}
        </HStack>
        <Heading color='gray.700'>{deck.name}</Heading>
        <DeckVariants deck={deck} />
      </Stack>
    );
  }
);

DeckHeader.displayName = 'DeckHeader';
