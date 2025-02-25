import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { resumeData } from '../data/resume';
import { FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

// Document Slingshot Animation Component
const DocumentSlingshotAnimation: React.FC<{ onLaunch?: () => void }> = ({ onLaunch }) => {
  const [isLaunched, setIsLaunched] = useState(false);

  const handleLaunch = () => {
    if (isLaunched) return;

    setIsLaunched(true);

    if (onLaunch) {
      setTimeout(() => {
        onLaunch();
      }, 300);
    }

    setTimeout(() => {
      setIsLaunched(false);
    }, 1500);
  };

  const docVariants = {
    idle: {
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    pulled: {
      y: 20,
      x: 0,
      scale: 1.2,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    launched: {
      y: -200,
      x: 0,
      scale: 0.8,
      rotate: 360,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.5
      }
    }
  };

  const elasticVariants = {
    idle: {
      scaleY: 1,
      y: 0
    },
    pulled: {
      scaleY: 1.5,
      y: 10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    launched: {
      scaleY: 0.8,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Colors that match the site theme
  const frameColor = '#F59E0B'; // Using primary color
  const elastic = '#FFFFFF';
  const docColor = '#F59E0B'; // Primary color
  const docLinesColor = '#FFFFFF'; // White lines for document

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.div
        className="cursor-pointer"
        onClick={handleLaunch}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Slingshot Y-shaped handle */}
          <motion.path
            d="M100 160 L60 80 L40 40 M100 160 L140 80 L160 40"
            stroke={frameColor}
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Elastic bands */}
          <motion.path
            d="M40 40 L100 70 M160 40 L100 70"
            stroke={elastic}
            strokeWidth="6"
            strokeLinecap="round"
            variants={elasticVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
          />

          {/* Document/Page shape */}
          <motion.g
            variants={docVariants}
            animate={isLaunched ? "launched" : "idle"}
            initial="idle"
            whileHover="pulled"
          >
            {/* Document base */}
            <rect
              x="88"
              y="55"
              width="24"
              height="30"
              rx="2"
              fill={docColor}
            />

            {/* Document fold */}
            <path
              d="M112 55 L106 61 L88 61"
              stroke={docColor}
              strokeWidth="2"
              fill={docColor}
            />

            {/* Document lines */}
            <line
              x1="93"
              y1="67"
              x2="107"
              y2="67"
              stroke={docLinesColor}
              strokeWidth="1"
            />
            <line
              x1="93"
              y1="72"
              x2="107"
              y2="72"
              stroke={docLinesColor}
              strokeWidth="1"
            />
            <line
              x1="93"
              y1="77"
              x2="107"
              y2="77"
              stroke={docLinesColor}
              strokeWidth="1"
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Impact effect - document/page emojis */}
      {isLaunched && (
        <>
          <motion.div
            className="absolute text-4xl"
            initial={{ opacity: 0, scale: 0, x: -100, y: -300 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: [-100, -150, -200],
              y: [-300, -350, -300]
            }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            📄
          </motion.div>
          <motion.div
            className="absolute text-3xl"
            initial={{ opacity: 0, scale: 0, x: -80, y: -280 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.3, 0],
              x: [-80, -100, -120],
              y: [-280, -320, -360]
            }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            📝
          </motion.div>
        </>
      )}
    </div>
  );
};

const Resume: NextPage = () => {
  const downloadResume = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = '/David Lieman Resume Feb 2025.pdf';
    link.download = 'David Lieman Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout title="&Goliath | Resume">
      <motion.div //  <---- ADD BACK motion.div HERE to wrap the whole content
        className="space-y-8 max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-100 mb-2">{resumeData.name}</h1>
          <p className="text-xl text-primary mb-4">{resumeData.title}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <a
              href={`mailto:${resumeData.contact.email}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <FaEnvelope /> {resumeData.contact.email}
            </a>
            <a
              href={`tel:${resumeData.contact.phone}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <FaPhone /> {resumeData.contact.phone}
            </a>
            <a
              href={`https://${resumeData.contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt /> {resumeData.contact.location}
            </span>
          </div>
        </div>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <p className="text-gray-300">{resumeData.summary}</p>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-serif text-primary mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(resumeData.skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-gray-300 font-medium mb-2 capitalize">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-xl font-serif text-primary">Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-100 font-medium">{exp.company}</h3>
                  <p className="text-primary">{exp.title}</p>
                </div>
                <span className="text-gray-400 text-sm">{exp.period}</span>
              </div>
              {exp.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.section>

        {/* Education Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-xl font-serif text-primary">Education</h2>
          {resumeData.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-100 font-medium">{edu.school}</h3>
                  <p className="text-primary">{edu.degree}</p>
                  {edu.location && (
                    <p className="text-gray-400 text-sm">{edu.location}</p>
                  )}
                  {edu.gpa && (
                    <p className="text-gray-400 text-sm">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-gray-400 text-sm">{edu.period}</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {edu.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.section>

        {/* Achievements Section */}
        {resumeData.achievements && (
          <motion.section
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-xl font-serif text-primary mb-4">Achievements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {resumeData.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Download Button with Slingshot */}
        <div className="flex flex-col items-center pt-4 space-y-2">
          <div className="flex items-center">
            <DocumentSlingshotAnimation onLaunch={downloadResume} />
            <span className="ml-2 text-gray-300">Download Resume</span>
          </div>
          <p className="text-sm text-gray-400">Click the slingshot to download</p>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Resume;