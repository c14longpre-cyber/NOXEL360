import { useState } from "react";
import NoxelAccessModal from "./NoxelAccessModal";

export default function NoxelAccessButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="account-btn"
        onClick={() => setOpen(true)}
      >
        Access
      </button>

      <NoxelAccessModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}