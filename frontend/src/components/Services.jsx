import React from 'react';
import { useData } from '../context/DataContext';
import { 
  HeartPulse, 
  Brain, 
  Baby, 
  Activity, 
  Sparkles, 
  Stethoscope, 
  ArrowUpRight 
} from 'lucide-react';

const iconMap = {
  HeartPulse: HeartPulse,
  Brain: Brain,
  Baby: Baby,
  Activity: Activity,
  Sparkles: Sparkles,
  Stethoscope: Stethoscope
};

const Services = ({ setActivePage }) => {
  const { departments } = useData();

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
            Our Specialties
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Specialized Care Across All Major Fields
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            From pediatric care to complex cardiology and neurology, our multi-disciplinary medical team delivers top tier clinical care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const IconComponent = iconMap[dept.icon] || HeartPulse;
            return (
              <div 
                key={dept.id}
                onClick={() => setActivePage('doctors')}
                className="group p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-cyan-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {dept.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                  <span>View Doctors</span>
                  <div className="w-7 h-7 rounded-full bg-cyan-50 group-hover:bg-cyan-100 flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;
