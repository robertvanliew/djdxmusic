import { Link } from 'react-router-dom';

// Author box for service and landing pages. No schema here on purpose: the
// site-wide Person entity (@id https://djdxmusic.com/#djdx, in index.html) is
// already on every page, so adding another would create a duplicate entity.
// Facts are limited to ones published elsewhere on the site, plus Brooklyn,
// which DJ DX supplied directly.
export default function AuthorBio() {
  return (
    <aside className="ab" aria-label="About DJ DX">
      <div className="ab-inner">
        <picture>
          <source type="image/webp" srcSet="/dj-dx-robert-van-liew-portrait.webp" />
          <img className="ab-photo" src="/dj-dx-robert-van-liew-portrait.jpg" width="96" height="96" alt="DJ DX (Robert Van Liew)" loading="lazy" decoding="async" />
        </picture>
        <div className="ab-copy">
          <p className="ab-name">DJ DX <span>(Robert Van Liew)</span></p>
          <p className="ab-text">
            Robert Van Liew has been DJing since 1998. Born in Jersey City and based in Brooklyn, he has played more than 500 events
            over 25+ years, from weddings and office parties to galas across New York, New Jersey and Connecticut. He performed at
            TEDxYouth@RVA and has been featured in Disrupt Magazine and NJ.com.
          </p>
          <p className="ab-links">
            <Link to="/epk">Press kit</Link>
            <a href="/#about">About DJ DX</a>
          </p>
        </div>
      </div>
    </aside>
  );
}
