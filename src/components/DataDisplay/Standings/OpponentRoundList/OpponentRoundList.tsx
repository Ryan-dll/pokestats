import {
  Card,
  CardBody,
  Divider,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useIsMobile } from '../../../../hooks/device';
import { usePlayerLiveResults } from '../../../../hooks/tournamentResults';
import { ordinalSuffixOf } from '../../../../lib/strings';
import { DeckInfoDisplay } from '../../../Deck/DeckInfoDisplay';
import { Record } from '../../../Tournament/Results/ResultsList/Record';
import { RecordIcon } from '../../../Tournament/Results/ResultsList/RecordIcon';
import { OpponentRoundListContent } from './OpponentRoundListContent';
interface OpponentRoundListProps {
  tournament: Tournament;
  player: Standing;
  modalOpen: boolean;
  handleCloseModal: () => void;
}

export const OpponentRoundList = (props: OpponentRoundListProps) => {
  const { tournament, player, modalOpen, handleCloseModal } = props;

  const isMobile = useIsMobile();
  const { shouldHideDecks } = usePlayerLiveResults(tournament.id, player.name);

  return (
    <Modal isOpen={modalOpen} onClose={handleCloseModal} size='md'>
      <ModalOverlay />
      <ModalContent margin={isMobile ? 'auto' : 0}>
        <ModalHeader padding={'0.5rem 2rem'}>
          <HStack>
            <Grid gridTemplateColumns={'2fr 1fr'} alignItems='center'>
              <Stack spacing={0}>
                <HStack>
                  <Text>{player.name}</Text>
                </HStack>
                <HStack alignItems='center'>
                  <HStack spacing={0}>
                    <RecordIcon standing={player} tournament={tournament} />
                    <Text fontSize='lg'>{ordinalSuffixOf(player.placing)}</Text>
                  </HStack>
                  <Record standing={player} normal />
                </HStack>
              </Stack>
              <DeckInfoDisplay
                tournament={tournament}
                player={player}
                enableEdits={false}
                disableList
                // Since we're pulling from post-tournament
                shouldHideDeck={shouldHideDecks}
              />
            </Grid>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={0} paddingX={0}>
          {modalOpen && (
            <OpponentRoundListContent tournament={tournament} player={player} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
