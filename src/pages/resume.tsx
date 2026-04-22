import type { NextPage } from 'next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { resumeData } from '../data/resume';
import { FaDownload, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const INITIAL_STOPWORDS = new Set(['of', 'the', 'and', 'at', 'for', 'de', 'a']);
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !INITIAL_STOPWORDS.has(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

const AVATAR_PALETTE = [
  'bg-primary/20 text-primary',
  'bg-pink/20 text-pink',
  'bg-cyan/20 text-cyan',
  'bg-green/20 text-green',
  'bg-orange/20 text-orange',
];

const Avatar: React.FC<{ name: string; logo?: string; index: number }> = ({ name, logo, index }) => {
  const [failed, setFailed] = useState(false);
  const showLogo = logo && !failed;
  if (showLogo) {
    return (
      <div className="flex-shrink-0 w-20 h-14 rounded-md bg-white flex items-center justify-center p-1.5 overflow-hidden" aria-hidden>
        <img
          src={logo}
          alt=""
          className="max-w-full max-h-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return (
    <div
      className={`flex-shrink-0 w-14 h-14 rounded-md flex items-center justify-center font-serif ${AVATAR_PALETTE[index % AVATAR_PALETTE.length]}`}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
};

const Resume: NextPage = () => {
  return (
    <Layout title="&Goliath | Resume">
      {/* Sticky sub-header with persistent download CTA */}
      <div className="sticky top-[57px] md:top-[65px] z-[5] -mx-4 px-4 py-2 bg-gray-950/85 backdrop-blur border-b border-gray-800 mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-sm text-gray-400 font-serif">
            {resumeData.name} · {resumeData.title}
          </span>
          <a
            href="/DavidLieman.pdf"
            download="DavidLieman.pdf"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-gray-950 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            <FaDownload size={12} />
            <span>PDF</span>
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-8 max-w-4xl mx-auto"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-100 mb-2">{resumeData.name}</h1>
          <p className="text-xl text-primary mb-4">{resumeData.title}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-300">
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

        {/* Consolidated skills row — one band, categorized inline */}
        <section className="bg-gray-800/60 rounded-lg px-5 py-4 shadow-lg">
          <div className="flex flex-col gap-3">
            {Object.entries(resumeData.skills).map(([category, items]) => (
              <div key={category} className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-medium w-20 flex-shrink-0">
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 bg-gray-700/70 text-gray-200 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {resumeData.summary && (
          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="text-gray-300">{resumeData.summary}</p>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-primary">Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg flex gap-4"
            >
              <Avatar name={exp.company} logo={exp.logo} index={index} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-gray-100 font-medium">{exp.company}</h3>
                    <p className="text-primary">{exp.title}</p>
                  </div>
                  <span className="text-gray-400 text-sm whitespace-nowrap">{exp.period}</span>
                </div>
                {exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-1.5 text-gray-300 text-sm">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-primary">Education</h2>
          {resumeData.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg flex gap-4"
            >
              <Avatar name={edu.school} logo={edu.logo} index={index + 2} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-2">
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
                  <span className="text-gray-400 text-sm whitespace-nowrap">{edu.period}</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-gray-300 text-sm">
                  {edu.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </section>

        {resumeData.achievements && (
          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-serif text-primary mb-4">Honors & Accomplishments</h2>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-gray-300 text-sm">
              {resumeData.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </section>
        )}
      </motion.div>
    </Layout>
  );
};

export default Resume;
