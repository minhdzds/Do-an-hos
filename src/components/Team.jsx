export default function Team() {
  return (
    <section className="team">
      <div className="container">
        <div className="team-header">
          <h2 className="section-heading">Our virtual dentist</h2>
          <a href="#!" className="btn team__cta">Meet our dentist</a>
        </div>

        <div className="team__list">
          <article className="team-item">
            <div className="team-item__img-bg">
              <img src="/assets/img/doc1.png" alt="Dr. Essence Page" className="team-item__thumb" />
            </div>
            <h3 className="team-item__name">Dr. Essence Page</h3>
            <p className="team-item__desc">DDS, California - Linda University</p>
          </article>

          <article className="team-item">
            <div className="team-item__img-bg">
              <img src="/assets/img/doc2.png" alt="Dr. Essence Page" className="team-item__thumb" />
            </div>
            <h3 className="team-item__name">Dr. Essence Page</h3>
            <p className="team-item__desc">DDS, California - Linda University</p>
          </article>

          <article className="team-item">
            <div className="team-item__img-bg">
              <img src="/assets/img/doc3.png" alt="Dr. Essence Page" className="team-item__thumb" />
            </div>
            <h3 className="team-item__name">Dr. Essence Page</h3>
            <p className="team-item__desc">DDS, California - Linda University</p>
          </article>

          <article className="team-item">
            <div className="team-item__img-bg">
              <img src="/assets/img/doc4.png" alt="Dr. Essence Page" className="team-item__thumb" />
            </div>
            <h3 className="team-item__name">Dr. Essence Page</h3>
            <p className="team-item__desc">DDS, California - Linda University</p>
          </article>
        </div>

        <div className="control team__control">
          <button className="control__btn">
            <svg className="control-icon" xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M5.5 1L0.5 6L5.5 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="control__btn">
            <svg className="control-icon control-icon--next" xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M5.5 1L0.5 6L5.5 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}