import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, Network, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="animate-slide-up">
          <h1 className="text-6xl sm:text-8xl font-semibold tracking-tighter text-primary mb-8 leading-[0.95]">
            Constructing <br />
            Intelligence.
          </h1>
          <p className="max-w-2xl text-xl sm:text-2xl text-secondary font-light leading-relaxed mb-10">
            DeepForge builds the foundational structures for advanced AI. 
            From experimental labs to production-grade products, we refine raw data into capability.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/solutions"
              className="inline-flex items-center px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-black transition-transform hover:-translate-y-1"
            >
              View Products
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center px-6 py-3 bg-surface text-primary border border-border text-sm font-medium rounded-full hover:bg-surfaceHighlight transition-colors"
            >
              Try Chat
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid / Philosophy */}
      <section className="border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border max-w-7xl mx-auto">
          
          {/* Card 1 */}
          <div className="p-8 sm:p-12 hover:bg-surface transition-colors group">
            <div className="mb-6 text-secondary group-hover:text-primary transition-colors">
              <Network strokeWidth={1} size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-3 tracking-tight">Systematic Research</h3>
            <p className="text-secondary text-sm leading-relaxed">
              We don't rely on black boxes. Our methodology is rooted in transparent, reproducible deep learning architectures designed for scale.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 sm:p-12 hover:bg-surface transition-colors group">
            <div className="mb-6 text-secondary group-hover:text-primary transition-colors">
              <Cpu strokeWidth={1} size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-3 tracking-tight">Compute Efficiency</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Optimizing inference latency. We build models that run faster and cost less, without compromising on reasoning capabilities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 sm:p-12 hover:bg-surface transition-colors group">
            <div className="mb-6 text-secondary group-hover:text-primary transition-colors">
              <Zap strokeWidth={1} size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-3 tracking-tight">Production Ready</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Bridging the gap between academic research and real-world utility. Our solutions are hardened for enterprise deployment.
            </p>
          </div>
          
        </div>
      </section>

      {/* Statement Section */}
      <section className="bg-surface py-24 sm:py-32 px-6 lg:px-8 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-6">
            "The best way to predict the future is to forge it."
          </h2>
          <p className="text-secondary">
            Our labs are open for exploration. Test our latest prototypes.
          </p>
          <div className="mt-8">
            <Link to="/demo" className="text-primary font-medium hover:text-secondary inline-flex items-center gap-1 border-b border-primary hover:border-secondary pb-0.5 transition-all">
              Launch Interactive Demo <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;