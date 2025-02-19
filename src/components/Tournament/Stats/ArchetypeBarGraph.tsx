import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  XAxis,
  LabelList,
} from 'recharts';
import { Deck, Tournament } from '../../../../types/tournament';
import { useDay2Decks } from '../../../hooks/day2decks';
import { useLowResImageUrls } from '../../../hooks/images';
import {
  getLowResUnownUrl,
  LOW_RES_SUBSTITUTE_URL,
} from '../../common/helpers';
import { getArchetypeGraphData, getArchetypeKey } from './helpers';

export const ArchetypeBarGraph = ({
  tournament,
  shouldDrillDown,
  shouldShowUnreported,
  shouldAnimate
}: {
  tournament: Tournament;
  shouldDrillDown: boolean;
  shouldShowUnreported: boolean;
  shouldAnimate: boolean
}) => {
  const { data } = useDay2Decks(tournament.id);
  const imageUrls = useLowResImageUrls(
    data?.reduce(
      (acc: string[], deck: Deck) => [
        ...acc,
        ...(deck.defined_pokemon ?? []),
      ],
      []
    ) ?? []
  );

  const renderCustomizedLabel = (props: Record<string, any>) => {
    const { y, width, height, value } = props;
    const definedPokemon = data?.find(
      (deck: Record<string, any>) =>
        value === getArchetypeKey(deck, shouldDrillDown)
    )?.defined_pokemon;

    return (
      <g>
        <image
          className='pixel-image'
          height={shouldDrillDown ? 20 : 30}
          opacity={shouldDrillDown ? 0.4 : 1}
          href={
            definedPokemon && definedPokemon.length > 0
              ? imageUrls?.[definedPokemon[0]]
              : getLowResUnownUrl()
          }
          x={width + 10}
          y={y}
        />
        {shouldDrillDown && (
          <image
            className='pixel-image'
            height={20}
            href={
              definedPokemon
                ? imageUrls?.[definedPokemon[1]]
                : getLowResUnownUrl()
            }
            x={width + 30}
            y={y}
          />
        )}
      </g>
    );
  };

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <BarChart
        width={300}
        height={300}
        data={getArchetypeGraphData(data, shouldDrillDown, shouldShowUnreported)}
        layout='vertical'
        reverseStackOrder
      >
        <Bar dataKey='value' fill={'#A0AEC0'} isAnimationActive={shouldAnimate}>
          <LabelList dataKey={'name'} content={renderCustomizedLabel} />
        </Bar>

        <XAxis type='number' dataKey='value' />
        <YAxis type='category' dataKey={'name'} hide />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
};
