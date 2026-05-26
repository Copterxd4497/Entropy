import { banners } from "../../data/BannersData";

export default function BannerStrip() {
  return (
    <div className="banners">
      {banners.map((card, i) => (
        <div
          key={i}
          className="banner-card"
          style={{
            background: card.bg,
            border: `1px solid ${card.accent}33`,
          }}
        >
          <div
            className="banner-card__orb"
            style={{ background: card.accent + "22" }}
          />
          <span className="banner-card__title">{card.title}</span>
        </div>
      ))}
    </div>
  );
}
