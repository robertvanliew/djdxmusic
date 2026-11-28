// One line under the hero on the main service pages: "Now booking 2027 and
// 2028." The button scrolls to the page's existing booking form (#booking);
// there is no separate form. Update the years here when the calendar moves.
export default function BookingPrompt() {
  return (
    <div className="bp" role="note">
      <p className="bp-text"><span className="bx-dot" aria-hidden="true" />Now booking 2027 and 2028. Check your date.</p>
      <a href="#booking" className="btn-gold bp-btn">Check My Date</a>
    </div>
  );
}
