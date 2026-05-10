export default function Footer() {
  return (
    <section className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__column">
            <a href="/"><img src="/assets/img/logo.svg" alt="shine heart" className="logo" /></a>
            <p className="footer__desc">Exceptional dental care for all ages. Your great smile begins with a great dentist.</p>
          </div>
          
          {/* ... các cột Support khác ... */}
          <div className="footer__column">
            <h3 className="footer__heading">Support</h3>
            <ul className="footer__list">
              <li className="footer__item"><a href="#!" className="footer__link">Help center</a></li>
              <li className="footer__item"><a href="#!" className="footer__link">Contact us</a></li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Subscribe</h3>
            <p className="footer__desc">Subscribe our newsletter for the latest update of Dental care</p>

            <form className="footer-form" action="">
              {/* Thẻ input phải đóng ở cuối bằng /> */}
              <input type="email" className="footer-form__input" placeholder="Enter your email..." />
              <button className="footer-form__submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer__copyright">
          <p className="footer__copyright-text">2021 GDN. Copyright and All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}