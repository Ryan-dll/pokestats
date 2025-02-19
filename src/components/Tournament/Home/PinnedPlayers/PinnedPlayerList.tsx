import {
  Button,
  Grid,
  Stack,
  Icon,
  useDisclosure,
  HStack,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import {
  FaHeart,
  FaMapPin,
  FaPlus,
  FaRegEdit,
  FaStar,
  FaTwitter,
} from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
import { useFinalResults } from '../../../../hooks/finalResults';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { CommonCard } from '../../../common/CommonCard';
import { ComponentLoader } from '../../../common/ComponentLoader';
import { PinnedPlayerCard } from './PinnedPlayerCard';
import { PinPlayerModal } from './PinPlayerModal';

interface PinnedPlayerListProps {
  tournament: Tournament;
  isCompact?: boolean;
}

export const PinnedPlayerList = (props: PinnedPlayerListProps) => {
  const session = useSession();
  const { data: pinnedPlayerNames, isLoading: arePinnedPlayersLoading } =
    usePinnedPlayers();

  const { data: tournamentPerformance, isLoading: areFinalResultsLoading } =
    useFinalResults({
      tournamentId: props.tournament.id,
    });

  const { data: liveTournamentResults, isLoading } = useLiveTournamentResults(
    props.tournament.id,
    { load: { allRoundData: true } }
  );
  const resultsAreLoading =
    (props.tournament.tournamentStatus === 'running' && isLoading) ||
    (props.tournament.tournamentStatus === 'finished' &&
      areFinalResultsLoading);

  const pinnedPlayers = pinnedPlayerNames
    ?.map(name => {
      const finalStanding = tournamentPerformance?.find(
        standing => standing.name === name
      );
      const liveStanding = liveTournamentResults?.data.find(
        liveResult => liveResult.name === name
      );

      if (finalStanding && liveStanding) {
        if (
          !finalStanding.deck?.defined_pokemon &&
          liveStanding.deck?.defined_pokemon
        ) {
          return {
            ...finalStanding,
            deck: liveStanding.deck,
          };
        }
      }

      return finalStanding ?? liveStanding;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;

      if (a.placing > b.placing) return 1;
      if (a.placing < b.placing) return -1;

      return 0;
    });
  const addPinPlayerModalControls = useDisclosure();
  const editPinnedPlayers = useDisclosure();

  const filteredPlayers = pinnedPlayers?.filter(player => player);

  if (
    props.isCompact &&
    pinnedPlayers?.filter(player => player)?.length === 0 &&
    !arePinnedPlayersLoading &&
    !resultsAreLoading
  )
    return null;

  if (props.isCompact && resultsAreLoading)
    return <ComponentLoader isLiveComponent />;

  return (
    <CommonCard
      header='Favorites'
      leftIcon={<Icon color='pink.500' as={FaHeart} />}
      ghost
      shouldRemovePadding={props.isCompact}
      smallHeader={props.isCompact}
    >
      <Stack>
        {(!props.isCompact && resultsAreLoading) || !pinnedPlayers ? (
          <ComponentLoader isLiveComponent />
        ) : (
          pinnedPlayers.map(
            pinnedPlayer =>
              pinnedPlayer && (
                <PinnedPlayerCard
                  key={`pinned-${pinnedPlayer?.name}`}
                  player={pinnedPlayer}
                  tournament={props.tournament}
                  shouldHideDecks={liveTournamentResults?.shouldHideDecks}
                  isDeckLoading={isLoading && !pinnedPlayer.deck?.id}
                  isEditingPinned={editPinnedPlayers.isOpen}
                  shouldHideOpponent={props.isCompact}
                  size={props.isCompact ? 'md' : 'lg'}
                />
              )
          )
        )}
        {filteredPlayers?.length === 0 && (
          <Stack paddingX={4} paddingY={2} spacing={4}>
            {pinnedPlayerNames && pinnedPlayerNames.length === 0 && (
              <Text fontWeight={'bold'} color='gray.600'>
                Keep up with your friends or anyone attending by adding a
                favorite player!
              </Text>
            )}
            {pinnedPlayerNames && pinnedPlayerNames.length > 0 && (
              <Text fontWeight={'bold'} color='gray.600'>
                None of your favorite players are attending this tournament.
              </Text>
            )}
            <Box>
              <Button
                leftIcon={<FaPlus />}
                onClick={addPinPlayerModalControls.onOpen}
                isDisabled={props.tournament.tournamentStatus === 'not-started'}
                size={'sm'}
                colorScheme='pink'
              >
                Add favorite
              </Button>
            </Box>
          </Stack>
        )}
        {!props.isCompact && filteredPlayers && filteredPlayers.length > 0 && (
          <HStack justifyContent={'space-around'}>
            <Button
              variant='ghost'
              leftIcon={<FaPlus />}
              onClick={addPinPlayerModalControls.onOpen}
              isDisabled={props.tournament.tournamentStatus === 'not-started'}
              size={'sm'}
              colorScheme='blackAlpha'
            >
              Add favorite
            </Button>
            {pinnedPlayers && pinnedPlayers.length > 0 && (
              <Button
                variant='ghost'
                leftIcon={<FaRegEdit />}
                onClick={editPinnedPlayers.onToggle}
                isDisabled={props.tournament.tournamentStatus === 'not-started'}
                size={'sm'}
                colorScheme={editPinnedPlayers.isOpen ? 'pink' : 'blackAlpha'}
              >
                {editPinnedPlayers.isOpen ? 'Stop editing' : 'Edit favorites'}
              </Button>
            )}
          </HStack>
        )}
        <PinPlayerModal
          tournament={props.tournament}
          modalControls={addPinPlayerModalControls}
        />
      </Stack>
    </CommonCard>
  );
};
