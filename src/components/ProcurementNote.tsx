import { Link } from 'react-router-dom';

// For corporate pages: the paperwork an office manager has to get past their
// own finance or procurement team before they can book anyone. Only lists
// what DJ DX has confirmed he provides (contract, COI, W-9) - he does NOT
// offer net-30 invoicing, so don't add it.
export default function ProcurementNote({ heading }: { heading?: string } = {}) {
  return (
    <section className="pn">
      <div className="pn-inner">
        <div className="sec-overline" style={{ justifyContent: 'center' }}>
          <span className="sec-overline-line" /><span className="sec-label">{heading || 'For Your Procurement Team'}</span><span className="sec-overline-line" />
        </div>
        <h2 className="sec-title pn-title">Easy to Approve, <span>Easy to Pay</span></h2>
        <div className="pn-grid">
          <div className="pn-item"><strong>Written contract</strong><span>On every booking: date, hours, fee, and terms.</span></div>
          <div className="pn-item"><strong>Certificate of insurance</strong><span>COI available for your venue and your risk team.</span></div>
          <div className="pn-item"><strong>W-9 on request</strong><span>So accounts payable can set DJ DX up as a vendor.</span></div>
          <div className="pn-item"><strong>Invoicing</strong><span>Deposit and balance invoices sent to whoever handles AP.</span></div>
          <div className="pn-item"><strong>Backup coverage</strong><span>A personally vetted backup DJ if an emergency strikes.</span></div>
        </div>
        <p className="pn-foot">50% deposit holds the date; balance due 14 days before. <Link to="/booking-policy">Full booking policy</Link></p>
      </div>
    </section>
  );
}
