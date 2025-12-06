import React from 'react';
import { Product } from '../types';
import { Box, Code, Layers, Mic, Eye, Database, ArrowRight } from 'lucide-react';

const products: Product[] = [
  {
    id: '1',
    name: 'ForgeVision',
    tagline: 'Computer Vision',
    description: 'Automated defect detection and quality control. Precision at scale.',
    status: 'Beta',
    icon: 'Eye'
  },
  {
    id: '2',
    name: 'DeepVoice',
    tagline: 'Neural Audio',
    description: 'Hyper-realistic human speech synthesis with emotional intonation.',
    status: 'Beta',
    icon: 'Mic'
  },
  {
    id: '3',
    name: 'DataAnvil',
    tagline: 'Data Processing',
    description: 'Structuring unstructured data pipelines for enterprise knowledge bases.',
    status: 'Concept',
    icon: 'Database'
  },
  {
    id: '4',
    name: 'CodeSmith',
    tagline: 'DevTools',
    description: 'Autonomous legacy code refactoring and security patching agent.',
    status: 'Concept',
    icon: 'Code'
  },
  {
    id: '5',
    name: 'Synapse',
    tagline: 'Networking',
    description: 'Predictive routing for data center traffic optimization.',
    status: 'Concept',
    icon: 'Layers'
  },
  {
    id: '6',
    name: 'Core SDK',
    tagline: 'Infrastructure',
    description: 'Direct model integration for Python and Node.js environments.',
    status: 'Concept',
    icon: 'Box'
  }
];

const IconMap: Record<string, React.FC<any>> = {
  Eye: Eye,
  Mic: Mic,
  Database: Database,
  Code: Code,
  Layers: Layers,
  Box: Box
};

const Solutions: React.FC = () => {
  return (
    <div className="w-full bg-surface min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-b border-border">
        <h1 className="text-5xl font-semibold tracking-tighter text-primary mb-6">Product Suite</h1>
        <p className="text-xl text-secondary max-w-2xl font-light">
          Deployment-ready intelligence. Our solutions are designed to integrate seamlessly into existing enterprise infrastructure.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const Icon = IconMap[product.icon] || Box;
            return (
              <div key={product.id} className="bg-white p-8 rounded-lg border border-border hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-72">
                <div>
                    <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-surface rounded-md text-primary">
                        <Icon strokeWidth={1.5} size={24} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-full ${
                        product.status === 'Production' ? 'bg-primary text-white' : 'bg-surfaceHighlight text-secondary'
                    }`}>
                        {product.status}
                    </span>
                    </div>
                    
                    <h3 className="text-xl font-medium text-primary mb-1">{product.name}</h3>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">{product.tagline}</p>
                    <p className="text-secondary text-sm leading-relaxed">
                    {product.description}
                    </p>
                </div>
                
                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Details <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Solutions;