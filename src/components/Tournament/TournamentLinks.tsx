import { Button, ButtonProps, HStack, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import {
  FaChess,
  FaDog,
  FaInfo,
  FaInfoCircle,
  FaMagic,
  FaTwitch,
  FaUserFriends,
} from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { useTournamentMetadata } from '../../hooks/tournamentMetadata';
import { getRK9TournamentUrl } from './helpers';

export const TournamentLinks = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const streamLink = useTournamentMetadata(tournament.id, 'stream').data?.at(
      0
    );

    const RK9ButtonProps: Partial<ButtonProps> = {
      size: 'sm',
      as: NextLink,
      variant: 'outline',
    };

    return (
      <HStack>
        {streamLink && (
          <Button
            variant={'solid'}
            colorScheme={'purple'}
            size='sm'
            leftIcon={<FaTwitch />}
            as={NextLink}
            href={streamLink.data}
            target='_blank'
          >
            Stream
          </Button>
        )}
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaChess />}
          href={getRK9TournamentUrl(tournament.rk9link, 'pairings')}
          target='_blank'
        >
          Pairings
        </Button>
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaInfo />}
          href={getRK9TournamentUrl(tournament.rk9link)}
          target='_blank'
        >
          Tournament Info
        </Button>
      </HStack>
    );
  }
);

TournamentLinks.displayName = 'TournamentLinks';
