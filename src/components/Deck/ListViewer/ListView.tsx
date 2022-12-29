import { Flex, GridItem, SimpleGrid, Image } from '@chakra-ui/react';
import { Card } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';

export const ListView = ({
  deckList,
  containerHeight,
}: {
  deckList: Record<string, any>;
  containerHeight: number;
}) => {
  const codeToSetMap = useCodeToSetMap();

  const getCardImageUrl = (card: {
    name: string;
    number: string;
    set: string;
  }) => {
    let set = codeToSetMap?.[card.set];
    if (!set) {
      return '';
    }

    if (card.number.includes('SWSH')) {
      set = 'swshp';
    } else if (card.number.includes('TG')) {
      set = set.replace('tg', '').concat('tg');
    } else if (card.number.includes('SV')) {
      set = set.replace('sv', '').concat('sv');
    }

    return `https://images.pokemontcg.io/${set}/${card?.number}.png`;
  };

  const heightWidthRatio = 1.396;
  const width = 92;
  const height = width * heightWidthRatio;

  const flatDeckList = ['pokemon', 'trainer', 'energy'].reduce(
    (acc: Card[], superclass) => [...acc, ...deckList[superclass]],
    []
  );
  const numberOfColumns = 4;
  const numberOfRows = Math.ceil(flatDeckList.length / numberOfColumns);
  const rowStackMargin = (height * numberOfRows - containerHeight) / (numberOfRows);

  return (
    <SimpleGrid
      id='list-grid-view'
      gridTemplateColumns={`repeat(${numberOfColumns}, 1fr)`}
      gap={0}
      marginLeft='12'
      marginTop={`${rowStackMargin}px`}
      height='100%'
    >
      {flatDeckList.map(
        (
          card: { name: string; number: string; set: string; count: number },
          idx: number
        ) => (
          <SimpleGrid
            key={idx}
            gridAutoFlow='column'
            marginLeft={'-12'}
            marginTop={`-${rowStackMargin}px`}
          >
            {[...Array(card.count)].map((_, idx) => (
              <GridItem
                key={idx}
                gridColumn={1}
                gridRow={1}
                paddingLeft={idx * 3}
              >
                <Image
                  background='black'
                  outline='3px solid'
                  width={`${width}px`}
                  height={`${height}px`}
                  src={getCardImageUrl(card)}
                  alt={`${card.name} ${card.set}`}
                />
              </GridItem>
            ))}
          </SimpleGrid>
        )
      )}
    </SimpleGrid>
  );
};
