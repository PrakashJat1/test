import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const HomePage = () => {
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Or however your `useAuth` hook stores it
    if (token) {
      try {
        const user = jwtDecode(token);

        switch (user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "management":
            navigate("/management");
            break;
          case "technical":
            navigate("/technical-trainer");
            break;
          case "softskill":
            navigate("/softskill-trainer");
            break;
          case "aptitude":
            navigate("/aptitude-trainer");
            break;
          case "labassistant":
            navigate("/labassistant");
            break;
          case "hr":
            navigate("/hr");
            break;
          case "student":
            navigate("/student");
            break;
          case "itep-applicant":
            navigate("/");
            break;
          default:
            navigate("/not-found");
            break;
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  return (
    // <>
    //   <div className="home-bg d-flex justify-content-center align-items-center min-vh-100">
    //     <div
    //       className="bg-white bg-opacity-75 p-5 rounded-4 shadow text-center"
    //       style={{ maxWidth: "400px", width: "100%" }}
    //     >
    //       <h1 className="fw-bold mb-4 text-dark">Welcome to IBFMS</h1>

    //       <div className="d-grid gap-3">
    //         <Link to="/login" className="btn btn-outline-primary btn-lg">
    //           Login
    //         </Link>
    //         <Link to="/signup" className="btn btn-primary btn-lg">
    //           Signup
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </>
    <>
      <Header />
      <main className="bg-light">
        <div className="container py-5 text-center">
          <h1 className="fw-bold mb-3">Welcome to InfoBeans Foundation</h1>
          <p className="lead mb-4">
            A CSR initiative by InfoBeans Technologies
          </p>

          <div className="row text-center">
            {[
              {
                title: "Skill Development",
                img: "https://assets.thehansindia.com/h-upload/2022/07/14/1302975-skills.webp",
                desc: "Empowering individuals with industry-relevant skills to enhance employability",
              },
              {
                title: "Community Initiatives",
                img: "https://communityinitiatives.org/wp-content/uploads/2022/11/community-iniatives-logo-300x206.png",
                desc: "Building stronger communities through targeted social programs",
              },
              {
                title: "Collaborations",
                img: "https://clipart-library.com/8300/1931/411-4119851_collaborate-service-asset-management.png",
                desc: "Partnering with leading institutions to create impactful programs",
              },
            ].map((card, idx) => (
              <div className="col-md-4 mb-4" key={idx}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={card.img}
                    className="card-img-top"
                    alt={card.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <h2 className="mb-4">What We Do</h2>
            <div className="row">
              <div className="p-4 bg-white shadow-sm rounded">
                <h4>ITEP (IT Education Program)</h4>
                <p>
                  A comprehensive program designed to provide IT skills to
                  underprivileged students. The curriculum includes web
                  development, programming, and digital literacy.
                </p>
                <Link
                  to="/signup"
                  className="btn text-white"
                  style={{ background: "#cf0829ff" }}
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
