import React from 'react';
import { Store, ShoppingCart, Rocket, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WhoWeHelpProps {
  onSelectService: (serviceName: string) => void;
}

export const WhoWeHelp: React.FC<WhoWeHelpProps> = ({ onSelectService }) => {
  const audiences = [
    {
      id: 'local-biz',
      title: 'Local Businesses & Retailers',
      description: 'Salons, showrooms, restaurants, and local services wanting consistent walk-in customers and high local Google ranking.',
      icon: Store,
      recommended: ['Google Business Profile', 'Meta Ads', 'WhatsApp Automation'],
    },
    {
      id: 'ecom-brands',
      title: 'E-commerce & D2C Brands',
      description: 'Clothing, jewelry, electronics, and specialty product brands aiming to scale nationwide online sales with low CAC.',
      icon: ShoppingCart,
      recommended: ['Ecommerce Website Development', 'Meta Ads', 'AI Video Ad Creation'],
    },
    {
      id: 'startups',
      title: 'Startups & Growing SMEs',
      description: 'Founders building innovative digital products needing high-converting landing pages, AI customer support, and fast execution.',
      icon: Rocket,
      recommended: ['Landing Pages', 'AI Website Chatbot', 'Business Workflow Automation'],
    },
    {
      id: 'professionals',
      title: 'Clinics, Doctors & Professionals',
      description: 'Dentists, doctors, legal firms, and consultants seeking patient credibility, automated booking, and verified local inquiries.',
      icon: Stethoscope,
      recommended: ['High-Trust Website', 'Google Ads', 'WhatsApp Scheduling'],
    },
  ];

  return (
    <section className="py-20 bg-[#071126] relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-cyan-300 border border-blue-400/25 mb-4 shadow-sm">
            <span>WHO WE SERVE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Tailored For <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Every Stage of Growth</span>
          </h2>

          <p className="mt-4 text-base text-slate-300 leading-relaxed font-normal">
            Whether you are launching your first storefront or scaling a 7-figure online brand, we customize digital solutions that align with your exact business model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0B1938]/90 border border-blue-500/20 flex flex-col justify-between hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300 shadow-lg group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-cyan-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-5 font-normal">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-800 pt-3 mb-5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recommended Stack:</span>
                    {item.recommended.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(item.recommended[0])}
                  className="w-full inline-flex items-center justify-between text-xs font-semibold text-cyan-300 hover:text-white pt-2 border-t border-slate-800 cursor-pointer"
                >
                  <span>Explore Suitable Setup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
