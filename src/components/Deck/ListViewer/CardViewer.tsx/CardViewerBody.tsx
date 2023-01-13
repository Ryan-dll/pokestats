import { Button, Heading, Image, ModalBody, Stack } from '@chakra-ui/react';
import { memo } from 'react';
import { Card } from '../../../../../types/tournament';
import { useCodeToSetMap } from '../../../../hooks/deckList';
import { getCardImageUrl } from '../helpers';

export const CardViewerBody = memo(
  ({
    card,
    clearSelectedCard,
  }: {
    card: Card;
    clearSelectedCard: () => void;
  }) => {
    const codeToSetMap = useCodeToSetMap();

    const heightWidthRatio = 1.396;
    const width = 200;
    const height = width * heightWidthRatio;

    return (
      <ModalBody>
        <Stack>
          <Button onClick={clearSelectedCard}>go back</Button>
          <Image
            width={`${width}px`}
            height={`${height}px`}
            src={getCardImageUrl(card, codeToSetMap, { highRes: true })}
            alt={`${card.name} ${card.set}`}
          />
          <Heading size='lg'> {card.name}</Heading>
        </Stack>
      </ModalBody>
    );
  }
);

CardViewerBody.displayName = 'CardViewer';
