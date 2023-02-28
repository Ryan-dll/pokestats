import { Badge, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Fragment } from 'react';
import {
  FaClock,
  FaMapMarker,
  FaMapMarkerAlt,
  FaRegClock,
} from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { useCountryCode, useLocation } from '../../../hooks/tournamentMetadata';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { TopDecks } from '../../Home/TopDecks';
import { TournamentStatusBadge } from '../../TournamentList/TournamentStatusBadge';
import { CountryFlag } from './CountryFlag';
import { getLocalTime, isInSameTimeZone } from './helpers';
import { MyTournamentView } from './MyTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TournamentHomeLinks } from './TournamentHomeLinks';

export interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const session = useSession();
  const { data: location } = useLocation(props.tournament?.id ?? '');
  const country = useCountryCode(props.tournament?.id ?? '');

  if (!props.tournament) return null;

  return (
    <Stack spacing={4} paddingY={4}>
      <Stack paddingX={6} spacing={2}>
        <Stack spacing={2} alignItems='center'>
          <Heading size='xl' color='gray.700' textAlign={'center'}>
            {props.tournament.name}
          </Heading>
          {location && country && (
            <HStack spacing='4'>
              <CountryFlag countryCode={country} />
              <Badge>
                <HStack>
                  <FaMapMarkerAlt />
                  <Text>{location.formatted_address}</Text>
                </HStack>
              </Badge>
              {!isInSameTimeZone(location.utc_offset_minutes) && (
                <Badge>
                  <HStack>
                    <FaRegClock />
                    <Text>{getLocalTime(location.utc_offset_minutes)}</Text>
                  </HStack>
                </Badge>
              )}
              <OpenEditTournamentInfo tournament={props.tournament} />
            </HStack>
          )}
          <HStack>
            <TournamentStatusBadge tournament={props.tournament} size='md' />
          </HStack>
        </Stack>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      {props.tournament.tournamentStatus === 'finished' && (
        <TopDecks tournament={props.tournament} />
      )}
      {session.status === 'authenticated' && (
        <Fragment>
          <MyTournamentView tournament={props.tournament} />
          <PinnedPlayerList tournament={props.tournament} />
        </Fragment>
      )}
    </Stack>
  );
};
