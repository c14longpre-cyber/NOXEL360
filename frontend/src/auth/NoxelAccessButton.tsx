import { useState } from "react";
import NoxelAccessModal from "./NoxelAccessModal";
import { useI18n } from "../useI18n";

export default function NoxelAccessButton() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <button
        type="button"
        className="account-btn"
        onClick={() => setOpen(true)}
      >
        {t("auth.access")}
      </button>

      <NoxelAccessModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}


