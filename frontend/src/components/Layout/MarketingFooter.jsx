import { Icon } from '../Icon.jsx';

export function MarketingFooter() {
  return (
    <footer className="footer footer--marketing">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="brand__mark brand__mark--small brand__mark--img">
            <img src="/logo.png" alt="CareerPrep Logo" className="brand__logo-img" />
          </div>
          <span>CareerPrep</span>
        </div>

        <div className="footer__links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Contact Support</a>
          <a href="/">Career Blog</a>
        </div>

        <div className="footer-actions">
          <button type="button" className="footer-icon-btn" title="Language">
            <Icon name="globe" />
          </button>
          <button type="button" className="footer-icon-btn" title="Support">
            <Icon name="mail" />
          </button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 CareerPrep AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
