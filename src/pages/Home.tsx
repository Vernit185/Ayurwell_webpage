import React, { useEffect } from 'react';
import { Footer } from '../components/layout/Footer';
import './Home.scss';

export function Home() {
  return (
    <>
      <div className="legacy-home">
      <header>
          <nav>
              <div className="logo">
                  <h2>AyurWell</h2>
              </div>

              <ul>
                  <li><a href="#hero">Home</a></li>
                  <li><a href="https://ayurwell-lime.vercel.app/login">Chatbot</a></li>
                  <li><a href="/knowledge-hub">Knowledge Hub</a></li>
                  <li><a href="/products">Marketplace</a></li>
                  <li><a href="/doctors">Doctors</a></li>
                  <li><a href="#about-ayurwell">About Us</a></li>
              </ul>

              <a href="https://ayurwell-lime.vercel.app/login"><button>Login</button></a>
          </nav>
      </header>

      <section id="hero">
          <div className="hero-text">
              <span className="hero-tag">
                  🌿 One Platform. Complete Ayurvedic Wellness.
              </span>

              <h1>
                  Your Complete <span>Ayurveda</span> Companion
              </h1>

              <p>
                  Discover authentic Ayurvedic knowledge, natural remedies,
                  wellness products, expert consultations and holistic healthcare —
                  all from one trusted platform.
              </p>

              <div className="hero-points">
                  <div>✔ Knowledge Hub</div>
                  <div>✔ AI Wellness Assistant</div>
                  <div>✔ Expert Doctors</div>
                  <div>✔ Authentic Products</div>
              </div>

              <div className="hero-buttons">
                  <a href="/knowledge-hub"><button className="primary-btn">
                      Explore Ayurveda
                  </button></a>

                  <a href="https://ayurwell-lime.vercel.app/login"><button className="secondary-btn">
                      Chat with Assistant
                  </button></a>
              </div>

              <div className="hero-stats">
                  <div>
                      <h3>500+</h3>
                      <p>Articles</p>
                  </div>
                  <div>
                      <h3>100+</h3>
                      <p>Products</p>
                  </div>
                  <div>
                      <h3>Expert</h3>
                      <p>Doctors</p>
                  </div>
              </div>
          </div>

          <div className="hero-image">
              <img src="/images/hero.png" alt="AyurWell Hero" />
          </div>
      </section>

      <section id="about-ayurwell">
          <h2>About AyurWell</h2>
          <p>
              AyurWell is a comprehensive Ayurvedic wellness platform
              that brings together traditional Ayurvedic knowledge,<br/>
              remedies, educational resources, wellness products,
              and expert consultations in one convenient place.<br/>
              Through AyurWell you can use our chatbot feature to predict your diseases
              by answering simple questions , identify remedies for your diseases and 
              many more !! 
          </p>
      </section>

      
      <section id="why-ayurveda">
          <div className="why-header">
              <h2>WHY AYURVEDA?</h2>
              <p>
                  Ayurveda is one of the world's oldest healthcare systems,
                  focusing on maintaining harmony between the body, mind and spirit.
                  Rather than simply treating diseases, Ayurveda promotes a healthy
                  lifestyle through balanced nutrition, natural remedies and preventive care.
              </p>
          </div>

          <div className="why-cards">
              <div className="why-card">
                  <h3>🌿 Natural Healing</h3>
                  <p>
                      Uses herbs, medicinal plants and natural ingredients
                      to support overall well-being.
                  </p>
              </div>

              <div className="why-card">
                  <h3>🧘 Holistic Lifestyle</h3>
                  <p>
                      Focuses on balancing physical,
                      mental and emotional health together.
                  </p>
              </div>

              <div className="why-card">
                  <h3>🛡 Preventive Healthcare</h3>
                  <p>
                      Encourages healthy habits that help
                      reduce the risk of illness before it develops.
                  </p>
              </div>

              <div className="why-card">
                  <h3>📜 Timeless Knowledge</h3>
                  <p>
                      Built upon thousands of years
                      of trusted Ayurvedic wisdom.
                  </p>
              </div>
          </div>
      </section>

      <section id="chatbot">
          <div className="assistant-box">
              <div className="assistant-text">
                  <h2>Your Personal Ayurveda Companion</h2>
                  <p>
                      Have questions about Ayurveda?
                      Chat with our ai-powered assistant to explore remedies,
                      understand Ayurvedic concepts and navigate the platform with ease.
                  </p>
                  <a href="https://ayurwell-lime.vercel.app/login">
                      <button className="assistant-btn">
                          Open Chatbot →
                      </button>
                  </a>
              </div>
          </div>
      </section>

      <section id="features">
          <h2>Our Other Services</h2>
          <div className="feature-container">
              <div className="feature-card" id="knowledgehub-card">
                  <h3>📚 Knowledge Hub</h3>
                  <p>
                      Discover informative articles, Ayurvedic principles,
                      herbal remedies, healthy lifestyle tips and wellness
                      guides to deepen your understanding of Ayurveda.
                  </p>
                  <a href="/knowledge-hub">
                      <button>Explore Articles →</button>
                  </a>
              </div>

              <div className="feature-card" id="marketplace-card">
                  <h3>🛍 Marketplace</h3>
                  <p>
                      Browse authentic Ayurvedic products including herbal
                      supplements, oils, powders and wellness essentials
                      recommended for a healthier lifestyle.
                  </p>
                  <a href="/products">
                      <button>Visit Marketplace →</button>
                  </a>
              </div>

              <div className="feature-card" id="doctors-card">
                  <h3>👨‍⚕️ Doctors & Clinics</h3>
                  <p>
                      Connect with experienced Ayurvedic doctors and discover
                      nearby clinics for professional consultation and
                      personalized wellness guidance.
                  </p>
                  <a href="/doctors">
                      <button>Find Experts →</button>
                  </a>
              </div>
          </div>
      </section>

      <section id="team">
          <h2>Meet the Team Behind AyurWell</h2>
          <div className="team-container">
              <div className="team-card">
                  <h3>Chinmay Jain</h3>
              </div>
              <div className="team-card">
                  <h3>Saksham Jagtap</h3>
              </div>
              <div className="team-card">
                  <h3>Vernit Garg</h3>
              </div>
              <div className="team-card">
                  <h3>Tanmay Joshi</h3>
              </div>
          </div>

          <div className="mentor-box">
              <h4>Project Mentor</h4>
              <h3>Mrs. Leena Sharma</h3>
          </div>
      </section>
      
      <section id="vision">
          <h2>Our Vision</h2>
          <p>
             "To make Ayurvedic wellness knowledge,
              remedies, products and expert guidance
              more accessible through a unified digital platform."
          </p>
      </section>

      </div>
      <Footer />
    </>
  );
}
