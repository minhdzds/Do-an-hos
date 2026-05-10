export default function Blog() {
  return (
    <section className="blog">
      <div className="container">
        <div className="blog__inner">
          <section className="blog__content">
            <h2 className="section-heading blog__heading">Read Latest News & Events.</h2>
            <a href="#!" className="blog__more">Read All Blog</a>

            <div className="control blog__control">
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
          </section>

          <div className="blog__list">
            <article className="blog-item">
              <figure className="blog-item__wrap">
                <img src="/assets/img/vac1.jpg" alt="Key Considerations for Regulatory Compliant." className="blog-item__thumb" />
              </figure>
              <section className="blog-item__body">
                <h3>
                  <a href="#!" className="blog-item__heading">Key Considerations for Regulatory Compliant.</a>
                </h3>
                <p className="blog-item__desc">It’s easy to think about medical care from a narrow perspective. You go to the hospital.</p>
                <a href="#!" className="blog-item__more">Learn More</a>
              </section>
            </article>

            <article className="blog-item">
              <figure className="blog-item__wrap">
                <img src="/assets/img/vac2.jpg" alt="What Is Population Health Management?" className="blog-item__thumb" />
              </figure>
              <section className="blog-item__body">
                <h3>
                  <a href="#!" className="blog-item__heading">What Is Population Health Management?</a>
                </h3>
                <p className="blog-item__desc">It’s easy to think about medical care from a narrow perspective. You go to the hospital.</p>
                <a href="#!" className="blog-item__more">Learn More</a>
              </section>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}