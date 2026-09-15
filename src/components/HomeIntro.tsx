import Link from 'next/link';
import { FaMapPin } from 'react-icons/fa';
import NameBurst from './NameBurst';

export default function HomeIntro() {
  return (
    <div className="prototype-copy">
      <div className="prototype-intro">
        <h1>Hi, I&apos;m <NameBurst>David Lieman</NameBurst></h1>
        <div className="prototype-location"><FaMapPin /> College Park, MD</div>
        <p>We&apos;re here <Link href="/because">because</Link></p>
      </div>
      <div className="prototype-body">
        <p>
          I&apos;m a Math/CS major at UMD graduating in Dec 2026, an{' '}
          <a href="https://www.atlasfellowship.org/" target="_blank" rel="noopener noreferrer">Atlas fellow</a>, an{' '}
          <a href="https://idealistscollective.org/" target="_blank" rel="noopener noreferrer">idealist</a>, currently at{' '}
          <a href="https://www.bridgewater.com/" target="_blank" rel="noopener noreferrer">Bridgewater</a>, and a reluctant utilitarian.
        </p>
        <p>
          I&apos;m currently spending my time thinking about religion, photography, the Sabbath, math puzzles, Blood on the Clocktower, and making my mind a better place to live in.
        </p>
        <p>
          I&apos;m currently trying to find interesting conversations, the Great American Novel, uncorrelated alpha, and meaning.
        </p>
        <p>
          If you&apos;ve ended up on this website, I&apos;d love to{' '}
          <a href="https://calendly.com/lieman/one-on-one" target="_blank" rel="noopener noreferrer">talk</a>.
        </p>
      </div>
    </div>
  );
}
