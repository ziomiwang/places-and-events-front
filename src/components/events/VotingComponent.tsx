import React, {useEffect, useState} from "react";
import { PlaceWithVotes } from "components/events/service/model/Event";

interface VotingComponentProps {
  places: Array<String>;
  eventId: string;
}
const VotingComponent = ({ places, eventId }: VotingComponentProps) => {
  const [placesVotes, setPlacesVotes] = useState<Array<PlaceWithVotes>>([]);

    useEffect(() => {
        const newArray = places.map(place => {
            return {
                place: place,
                votes: 0,
            }
        }) as Array<PlaceWithVotes>
        setPlacesVotes(newArray)
    }, [places]);

  return (
    <div style={{ borderBottom: "1px solid lightgray", height: "80px" }}>
      Voting
        <div style={{display: "flex", gap: "20px"}}>
            {placesVotes.map((placeVote => (
                <div>
                    <div>{placeVote.place}</div>
                    <div>{placeVote.votes}</div>
                    <button>vote</button>
                </div>
            )))}
        </div>
    </div>
  );
};

export default VotingComponent;
