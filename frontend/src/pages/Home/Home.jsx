import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import logo from '../../assets/Linklogo.png'
const Home = () => {
  return (
    <div>
    <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo max-sm:h-10" />
        </div>
        <div className="navbar-center font-poppins max-md:hidden">
          <a href="#">Home</a>
          <a href="#about-us">About Us</a>
          <a href="#help">Help</a>
          <a href="#customer-stories">Reviews</a>
        </div>
        <div className="navbar-right">
          <button className='btn-login font-outfit'>
            <Link to='/login'>Login</Link>
          </button>
          <button className='btn-signup'>
            <Link to='/signup'>Sign Up</Link>
          </button>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-content">
          <section className="welcome-section">
            <div className="welcome-container">
              <div className="animation-box">
                <dotlottie-player 
                  src="https://lottie.host/afc9f7a5-5593-4471-98ad-8ca30b4041ff/v89GSRQbpD.lottie"
                  background="transparent"
                  speed="1"
                  style={{width: '300px', height: '300px'}}
                  // style="width: 300px; height: 300px"
                  loop autoplay>
                </dotlottie-player>
              </div>
              <div className="welcome-text">
                <h1 className='font-outfit'>Welcome to LinkBridge</h1>
                <p className='font-outfit'>LinkBridge connects students, teachers, and industry professionals to collaborate on real-world projects, exchange ideas, and grow together.</p>
                <a href="#" className="hero-btn">Explore Projects</a>
              </div>
            </div>
          </section>
        </div>
      </section>
        <section id='help' className="how-it-works font-poppins">
          <h2 className='font-outfit'>How It Works</h2>
          <div className="steps">
            <div className="step">
              <i className="fas fa-user-plus"></i>
              <h3 className='font-outfit'>Sign Up</h3>
              <p>Create your account as a student, mentor, or professional.</p>
            </div>
            <div className="step">
              <i className="fas fa-folder-open"></i>
              <h3 className='font-outfit'>Explore Projects</h3>
              <p>Browse innovative ideas or post your own.</p>
            </div>
            <div className="step">
              <i className="fas fa-handshake"></i>
              <h3 className='font-outfit'>Collaborate</h3>
              <p>Connect with peers and mentors to develop your project.</p>
            </div>
            <div className="step">
              <i className="fas fa-comments"></i>
              <h3 className='font-outfit'>Get Feedback</h3>
              <p>Receive helpful reviews to improve your work.</p>
            </div>
            <div className="step">
              <i className="fas fa-bullhorn"></i>
              <h3 className='font-outfit'>Showcase</h3>
              <p>Publish and showcase your final product to the community.</p>
            </div>
          </div>
        </section>

      <section id='customer-stories' className="customer-stories">
        <h2 className='font-outfit'>Customer Stories</h2>
        <div className="card-container font-poppins">
          <div className="story-card">
            <p>“LinkBridge helped me connect with a mentor who guided my final year project.”</p>
            <strong>- Ayesha, Student</strong>
          </div>
          <div className="story-card">
            <p>“I found a group of students to develop my startup prototype through Link Bridge.”</p>
            <strong>- Mr. Salman, Industry Professional</strong>
          </div>
          <div className="story-card">
            <p>“This platform brings education and real-world collaboration together beautifully.”</p>
            <strong>- Ms. Hina, University Lecturer</strong>
          </div>
        </div>
      </section>
      <section id='about-us' className="about-us">
        <h2 className='font-outfit'>About Us</h2>
        <div className="team-members">
          <div className="member">
            <img src="https://cdn-icons-png.flaticon.com/512/236/236831.png" alt="Male Icon" />
            <p className='font-poppins'>Furqan Abbas</p>
            <span className='text-sm italic'>Co-Founder, LinkBridge</span>
          </div>
          <div className="member">
            <img src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png" alt="Female Icon" />
            <p className='font-poppins'>Amna Asif</p>
            <span className='text-sm italic'>Co-Founder, LinkBridge</span>

          </div>
        </div>
      </section>
      <footer className="footer">
        {/* <!-- Footer Content --> */}
        <div className="footer-content">
          {/* <!-- Left: Social Icons --> */}
          <div className="social-icons flex">
            <a href="https://instagram.com" target="_blank">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" />
            </a>
            <a href="https://facebook.com" target="_blank">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
            </a>
            <a href="https://github.com" target="_blank">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" />
            </a>
          </div>
      
          {/* <!-- Right: Contact Info --> */}
          <div className="contact-info">
            <p><strong>Contact Us:</strong> +92 311 7879393</p>
            <p><strong>Email Us:</strong> linkbridge@gmail.com</p>
          </div>
        </div>
      </footer>
      
    </div>
  )
}

export default Home