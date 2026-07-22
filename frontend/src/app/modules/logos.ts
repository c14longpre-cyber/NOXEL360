import noxel360 from "@/assets/logos/webp/noxel-360.webp";
import seo from "@/assets/logos/webp/noxel-seo.webp";
import nexus from "@/assets/logos/webp/noxel-nexus.webp";

// TODO(Christian): drop a real NOXEL Forge logo file in
// @/assets/logos/webp/noxel-forge.webp and swap this import.
// Using the NOXEL360 mark as a placeholder for now.
const forge = noxel360;

export const LOGO_BY_ID: Record<string, string> = {
  "360": noxel360,
  seo,
  forge,
  nexus,
};

export default LOGO_BY_ID;
