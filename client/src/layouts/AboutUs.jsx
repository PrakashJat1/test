import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";

export default function AboutUs() {
  return (
    <>
      <Header />
      <main className="py-5 bg-light pt-5 ">
        <div className="container">
          {/* Mission and Vision */}
          <div className="row mb-5">
            <div className="col-md-6 mb-4">
              <div className="p-4 bg-white shadow rounded h-100">
                <h4 className="fw-bold">Our Mission</h4>
                <p>
                  To empower underprivileged communities through quality
                  education, skill development, and sustainable initiatives that
                  create lasting positive impact.
                </p>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="p-4 bg-white shadow rounded h-100">
                <h4 className="fw-bold">Our Vision</h4>
                <p>
                  A world where every individual has access to opportunities for
                  growth and development, regardless of their socioeconomic
                  background.
                </p>
              </div>
            </div>
          </div>

          {/* Collaborations */}
          <div className="mb-4">
            <h3 className="fw-bold mb-4 text-center">Our Collaborations</h3>
            <div className="row g-4">
              {/* Collaboration 1 */}
              <div className="col-md-4">
                <div className="d-flex align-items-start bg-white p-3 rounded shadow h-100">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzbVXs_SCRywlJ5CLggu9lbIWNOA_lxyBTaA&s"
                    alt="IIT Indore"
                    className="me-3 rounded"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <h5 className="fw-semibold mb-1">IIT Indore</h5>
                    <p className="mb-0 small">
                      Collaborative research and educational initiatives
                    </p>
                  </div>
                </div>
              </div>

              {/* Collaboration 2 */}
              <div className="col-md-4">
                <div className="d-flex align-items-start bg-white p-3 rounded shadow h-100">
                  <img
                    src="https://www.ccsp.ox.ac.uk/sites/default/files/styles/mt_image_medium/public/ccsp/images/media/ngo_0.jpg?itok=kfqt-8Eu"
                    alt="NGOs"
                    className="me-3 rounded"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <h5 className="fw-semibold mb-1">Local NGOs</h5>
                    <p className="mb-0 small">
                      Partnerships for community development projects
                    </p>
                  </div>
                </div>
              </div>

              {/* Collaboration 3 */}
              <div className="col-md-4">
                <div className="d-flex align-items-start bg-white p-3 rounded shadow h-100">
                  <img
                    src="https://www.csrindia.org/wp-content/uploads/2022/09/CORPORATE.png"
                    alt="Corporate Partners"
                    className="me-3 rounded"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <h5 className="fw-semibold mb-1">Corporate Partners</h5>
                    <p className="mb-0 small">
                      Joint CSR initiatives with leading companies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
