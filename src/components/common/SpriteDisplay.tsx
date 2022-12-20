import { Flex, Image, Stack } from '@chakra-ui/react';

interface SpriteDisplayProps {
  pokemonNames: string[];
}

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const spritebaseUrl =
    'https://limitlesstcg.s3.us-east-2.amazonaws.com/pokemon/gen8-v3';

  return (
    <Stack direction={'row'} spacing={1}>
      {props.pokemonNames.map((name, idx) => {
        if (!name || name.length === 0) return;

        return (
          <Image
            key={idx}
            src={`${spritebaseUrl}/${name.toLowerCase()}.png`}
            alt={name}
            maxHeight='30px'
            width='auto'
          />
        )
      })}
    </Stack>
  );
}
