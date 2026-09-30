// Client quotes from the NautaDutilh New York reception (June 2026). That
// booking was the Soul Shades DJ + live violin duo, and both quotes talk about
// the violin, so they only appear on duo pages (Soul Shades, violin + DJ duo)
// and are labelled as duo feedback on the homepage. Solo DJ pages link here
// instead of showing them.
const DUO_QUOTES = [
  { quote: "The music was just perfect and the vibe was great. I love the uniqueness of keyboard and violin together with DJing — I don't think there are a lot of DJs who come with this built into the duo.", name: 'Sue Krebs', company: 'NautaDutilh New York P.C.' },
  { quote: "Your performance set the tone for our event, and the addition of the violin amplified our guests' experience and made the evening memorable.", name: 'Anna Naraine', company: 'NautaDutilh New York P.C.' },
];

export default function DuoTestimonials() {
  return (
    <div className="duo-q" role="region" aria-label="Client feedback on the DJ and violin duo">
      <div className="duo-q-inner">
        <h2 className="duo-q-title">What Clients Say About the Duo</h2>
        <p className="duo-q-note">From the Soul Shades DJ and live violin booking for NautaDutilh New York, June 2026.</p>
        <div className="duo-q-grid">
          {DUO_QUOTES.map(q => (
            <blockquote key={q.name} className="duo-q-card">
              <p>&ldquo;{q.quote}&rdquo;</p>
              <cite>{q.name}<span>, {q.company}</span></cite>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}
