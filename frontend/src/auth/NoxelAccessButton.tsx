import { useState } from "react";
import NoxelAccessModal from "./NoxelAccessModal";
import { useI18n } from "../useI18n";
import { HudButton } from "../components/hud/HudButton";

export default function NoxelAccessButton() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <HudButton
        action="continue"
        compact
        className="access-hud"
        label={t("auth.access")}
        onClick={() => setOpen(true)}
      />

      <NoxelAccessModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}


