import type { NextPage } from 'next';
import Layout from '../components/Layout';
import FinalBattleBackground from '../components/FinalBattleBackground';
import HomeIntro from '../components/HomeIntro';
import BattleReadouts from '../components/BattleReadouts';

const Home: NextPage = () => {
  return (
    <div className="particle-experience">
      <FinalBattleBackground />
      <BattleReadouts />
      <Layout title="&Goliath | Home" description="David Lieman's website.">
        <div className="study-page">
          <section className="study study-particles">
            <HomeIntro />
          </section>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
