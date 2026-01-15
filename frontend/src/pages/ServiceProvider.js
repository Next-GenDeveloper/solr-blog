import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaCertificate, FaHeadset, FaCheckCircle } from 'react-icons/fa';
import './ServiceProvider.css';

const ServiceProvider = () => {
  const services = [
    {
      icon: <FaTools />,
      title: 'Installation Services',
      description: 'Professional installation of solar panels and equipment by certified technicians.',
      features: ['Site Assessment', 'Custom Design', 'Professional Installation', 'System Testing'],
    },
    {
      icon: <FaCertificate />,
      title: 'Consultation & Planning',
      description: 'Expert guidance to help you choose the right solar solution for your needs.',
      features: ['Energy Audit', 'Cost Analysis', 'ROI Calculation', 'Financing Options'],
    },
    {
      icon: <FaHeadset />,
      title: 'Maintenance & Support',
      description: 'Ongoing maintenance and 24/7 support to keep your system running optimally.',
      features: ['Regular Inspections', 'Performance Monitoring', 'Repairs & Upgrades', '24/7 Support'],
    },
  ];

  return (
    <div className="service-page">
      <section className="service-hero">
        <div className="service-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Comprehensive solar energy solutions tailored to your needs
          </motion.p>
        </div>
      </section>

      <section className="services-section section-padding">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <FaCheckCircle className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-choose-section section-padding">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Our Services?</h2>
          </motion.div>
          <motion.div
            className="why-choose-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p>
              With over a decade of experience in the solar industry, we provide top-tier
              services that ensure maximum efficiency and longevity of your solar investment.
              Our team of certified professionals is committed to delivering excellence at
              every step of your solar journey.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceProvider;
