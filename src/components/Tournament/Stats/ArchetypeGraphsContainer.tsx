import {
  FormControl,
  FormLabel,
  Heading,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ArchetypeGraph } from './ArchetypeGraph';
import { ArchetypeBarGraph } from './ArchetypeBarGraph';
import { Tournament } from '../../../../types/tournament';

export const ArchetypeGraphsContainer = ({
  tournament,
  allDay2DecksSubmitted,
}: {
  tournament: Tournament;
  allDay2DecksSubmitted: boolean;
}) => {
  const [shouldShowBothCharts, setShouldShowBothCharts] = useState(false);
  const [shouldDrillDown, setShouldDrillDown] = useState(false);
  const [shouldShowUnreported, setShouldShowUnreported] = useState(true);
  const [shouldToggleShowPieChart, setShouldToggleShowPieChart] = useState(true);

  useEffect(() => {
    if (window.innerWidth >= 700) {
      setShouldShowBothCharts(true);
    }
  }, []);

  const shouldShowPieChart = shouldShowBothCharts || shouldToggleShowPieChart;
  const shouldShowBarChart = shouldShowBothCharts || !shouldToggleShowPieChart

  return (
    <Stack padding={'0 1.5rem'}>
      <Stack alignItems={'center'} direction='row' spacing={0}>
        {shouldShowPieChart && (
          <ArchetypeGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
            shouldShowUnreported={shouldShowUnreported}
          />
        )}
        {shouldShowBarChart && (
          <ArchetypeBarGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
            shouldShowUnreported={shouldShowUnreported}
          />
        )}
      </Stack>
      <Stack>
        <Heading color='gray.700' size={'md'}>
          Day 2 Archetype Spread
        </Heading>
        <FormControl
          as={SimpleGrid}
          gridTemplateColumns={'auto auto auto auto'}
          alignItems='center'
          maxWidth={'500px'}
        >
          <FormLabel htmlFor='archetype-drill-down' mb='0'>
            Drill down
          </FormLabel>
          <Switch
            id='archetype-drill-down'
            onChange={() => setShouldDrillDown(!shouldDrillDown)}
          />
          <FormLabel htmlFor='show-pie-chart' mb='0'>
            Pie chart
          </FormLabel>
          <Switch
            id='show-pie-chart'
            onChange={() => setShouldToggleShowPieChart(!shouldToggleShowPieChart)}
            defaultChecked
          />
          {!allDay2DecksSubmitted && (
            <>
              <FormLabel htmlFor='show-unreported' mb='0'>
                Show unreported
              </FormLabel>
              <Switch
                defaultChecked={shouldShowUnreported}
                id='show-unreported'
                onChange={() => setShouldShowUnreported(!shouldShowUnreported)}
              />
            </>
          )}
        </FormControl>
      </Stack>
      {!shouldShowUnreported && (
        <Text as='b' color='red.600'>
          Data does not include unreported decks
        </Text>
      )}
    </Stack>
  );
};
