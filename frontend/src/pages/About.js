import React from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaGlobe, FaHandshake } from 'react-icons/fa';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
  const stats = [
    { icon: <FaUsers />, number: '10,000+', label: 'Happy Customers' },
    { icon: <FaAward />, number: '50+', label: 'Awards Won' },
    { icon: <FaGlobe />, number: '30+', label: 'Countries Served' },
    { icon: <FaHandshake />, number: '100+', label: 'Partner Companies' },
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries to bring you the most advanced solar technology.',
    },
    {
      title: 'Sustainability',
      description: 'Our commitment to the environment drives everything we do.',
    },
    {
      title: 'Quality',
      description: 'We never compromise on the quality of our products and services.',
    },
    {
      title: 'Customer First',
      description: 'Your satisfaction and success are at the heart of our mission.',
    },
  ];

  return (
    <div className="about-page">
      <SEO
        title="About Us - Solar Energy Experts"
        description="Learn about our mission to provide sustainable solar energy solutions. Discover our values, team, and commitment to a greener future."
        keywords="about us, solar energy, renewable energy, sustainability, green energy, solar experts"
        type="website"
      />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Solar Expert
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Leading the renewable energy revolution since 2010
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section section-padding">
        <div className="container">
          <div className="mission-grid">
            <motion.div
              className="mission-card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Our Mission</h2>
              <p>
                To empower individuals and businesses worldwide with accessible, 
                efficient, and sustainable solar energy solutions. We believe in 
                creating a cleaner, greener future by making renewable energy 
                the standard, not the exception.
              </p>
            </motion.div>

            <motion.div
              className="mission-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Our Vision</h2>
              <p>
                To be the world's most trusted solar energy provider, recognized 
                for innovation, quality, and exceptional customer service. We 
                envision a world where clean energy is accessible to all, 
                reducing our collective carbon footprint.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section section-padding">
        <div className="container">
          <motion.div
            className="story-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Story</h2>
            <p>
              Founded in 2010, Solar Expert began with a simple yet powerful vision: 
              to make solar energy accessible to everyone. What started as a small 
              team of passionate engineers has grown into a leading global provider 
              of solar solutions.
            </p>
            <p>
              Over the years, we've helped thousands of homeowners and businesses 
              transition to clean energy, reducing millions of tons of CO2 emissions. 
              Our commitment to innovation has led us to develop cutting-edge solar 
              technology that's both efficient and affordable.
            </p>
            <p>
              Today, we continue to push the boundaries of what's possible in 
              renewable energy, always keeping our customers and the planet at 
              the forefront of everything we do.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section section-padding">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Core Values</h2>
            <p>The principles that guide us every day</p>
          </motion.div>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section section-padding">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Meet Our Team</h2>
            <p>Dedicated professionals committed to your success</p>
          </motion.div>
          <motion.div
            className="team-description"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p>
              Our team consists of experienced engineers, designers, and customer 
              service professionals who are passionate about renewable energy. 
              Together, we work tirelessly to provide you with the best solar 
              solutions and support.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
