import {
  Heading,
  Stack,
  LinkOverlay,
  LinkBox,
  Badge,
  HStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { AdminBadge } from '../../common/AdminBadge';

export const AppLogo = ({ smol, big }: { smol?: boolean; big?: boolean }) => {
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <Stack direction='row' alignItems='center'>
      <LinkBox>
        <LinkOverlay href={`/`} as={NextLink}>
          <HStack spacing={1} alignItems='baseline'>
            <Stack direction={'row'} alignItems='center' spacing={0}>
              <Heading
                color={'gray.700'}
                letterSpacing={'wider'}
                size={big ? 'xl' : smol ? 'sm' : 'md'}
                fontWeight={'black'}
                lineHeight={'taller'}
              >
                pokéstats
              </Heading>
              <Heading
                letterSpacing={'wider'}
                size={big ? 'xl' : smol ? 'sm' : 'md'}
                fontWeight={'black'}
                color='red.600'
              >
                .live
              </Heading>
            </Stack>
            <Badge>Beta</Badge>
            {userIsAdmin && <AdminBadge />}
          </HStack>
        </LinkOverlay>
      </LinkBox>
    </Stack>
  );
};
