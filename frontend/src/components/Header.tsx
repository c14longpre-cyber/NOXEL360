import HeaderLanguage from "./HeaderLanguage";

export default function Header() {
  return (
    <header className="noxel-header">
      <div className="hdr-left">
        <div className="brand">NOXEL360</div>
      </div>

      <div className="hdr-right">
        <HeaderLanguage />
      </div>
    </header>
  );
}