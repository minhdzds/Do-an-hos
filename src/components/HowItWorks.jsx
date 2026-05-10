export default function HowItWorks() {
  return (
    <section className="work">
      <div className="container">
        <h2 className="section-heading">How it works</h2>
        <p className="section-desc work__desc">Exceptional dental care for all ages. Your great smile begins with a great dentist.</p>

        <div className="work__list">
          <section className="work-item">
            <img src="/assets/img/Orion_search.svg" alt="" className="work-item__icon" />
            <h3 className="work-item__heading">Search doctor</h3>
            <p className="work-item__desc">Search a doctor by education, qualifications or experience-contact for inquiry.</p>
            <a href="#!" className="work-item__more">Learn More</a>
          </section>

          <section className="work-item">
            <img src="/assets/img/Orion_find-user.svg" alt="" className="work-item__icon" />
            <h3 className="work-item__heading">Find best doctor</h3>
            <p className="work-item__desc">Search a doctor by education, qualifications or experience-contact for inquiry.</p>
            <a href="#!" className="work-item__more">Learn More</a>
          </section>

          <section className="work-item">
            <img src="/assets/img/Orion_first-aid-kit.svg" alt="" className="work-item__icon" />
            <h3 className="work-item__heading">Get treatment</h3>
            <p className="work-item__desc">Search a doctor by education, qualifications or experience-contact for inquiry.</p>
            <a href="#!" className="work-item__more">Learn More</a>
          </section>
        </div>
      </div>
    </section>
  );
}