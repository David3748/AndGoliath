import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { resumeData } from '../data/resume';
import { FaDownload, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Resume: NextPage = () => {
  return (
    <Layout title="&Goliath | Resume">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <p className="text-gray-300">{resumeData.summary}</p>
        </section>

        {/* Skills Section */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
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
        </section>

        {/* Experience Section */}
        <section className="space-y-6">
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
        </section>

        {/* Education Section */}
        <section className="space-y-6">
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
        </section>

        {/* Achievements Section */}
        {resumeData.achievements && (
          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-serif text-primary mb-4">Achievements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {resumeData.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Download Button */}
        <div className="flex justify-center pt-4">
          <motion.a
            href="/David Lieman Resume Feb 2025.pdf"
            download="David Lieman Resume.pdf"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <FaDownload />
            <span>Download Resume</span>
          </motion.a>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Resume;