export default function Install() {
  return (
    <section className="install">
      <div className="container">
        <div className="install__inner">
          <figure>
            <img src="/assets/img/Rectangle.png" alt="" className="install__img" />
          </figure>
          <section className="install__content">
            <h2 className="section-heading install__heading">Take back your smile with dentures</h2>
            <p className="install__desc">If you’re missing multiple teeth due to decay, injury, or the natural aging process, dentures might be the perfect solution.</p>
            <div className="install__row">
              <a href="#!">
                <img src="/assets/img/Googleplay.svg" alt="" className="install__btn-img" />
              </a>
              <a href="#!">
                <img src="/assets/img/Appstore.svg" alt="" className="install__btn-img" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}