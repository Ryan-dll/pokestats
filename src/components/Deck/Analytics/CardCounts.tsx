import { Deck } from "../../../../types/tournament";
import { useCardCounts } from "../../../hooks/finalResults";

export const CardCounts = ({ deck }: { deck: Deck }) => {
  const cardCounts = useCardCounts(deck);

  return <div></div>
}