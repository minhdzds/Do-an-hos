export default function About() {
  return (
    <section className="about">
      <div className="container">
        <div className="about-row">
          <div className="about__media">
            <figure className="about__img">
              <img src="/assets/img/hero-1.jpg" alt="" className="about__img--big" />
              <img src="/assets/img/hero-2.jpg" alt="" className="about__img--small" />
            </figure>
          </div>
          <section className="about-content">
            <h2 className="section-heading">Take back your smile with shine.</h2>
            <p className="section-desc">If you’re missing multiple teeth due to decay, injury, or the natural aging process, dentures might be the perfect solution.</p>
            <a href="#!" className="btn about-content__btn">Learn More</a>
          </section>
        </div>
      </div>
    </section>
  );
}