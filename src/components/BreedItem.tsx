import React from "react";
import type { Breed } from "../services/catsApi";
import BreedCard from "./BreedCard";
import BreedModal from "./BreedModal";

function BreedItem({ breed }: { breed: Breed }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer transition hover:scale-[1.01]"
      >
        <BreedCard breed={breed} />
      </div>
      <BreedModal breed={breed} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default BreedItem;