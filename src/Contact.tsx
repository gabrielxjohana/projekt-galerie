import { Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import galerie from "./photos/galerie.jpeg";

export function Contact() {
  return (
      <section id="contact" className="py-24 md:py-32 bg-[#1a1a1a] relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left side - Main content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
              {/* Section header */}
              <div className="mb-12">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="h-px bg-white mb-6"
                />
                <span className="block uppercase tracking-[0.2em] text-sm text-gray-400 mb-6">Spojte se s námi</span>
                <h2 className="text-5xl md:text-6xl lg:text-7xl leading-tight mb-8 text-white">
                  Kontakt
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Pro dotazy ohledně dostupných děl, výstav nebo jakékoliv další
                  informace o uměleckém díle Antonína Kroči nás neváhejte kontaktovat.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-[#2a2a2a] border-l-2 border-white hover:bg-[#333333] transition-all">
                    <div className="mt-1 text-white">
                      <Mail className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">Email</p>
                      <a
                          href="mailto:info@galeriekroca.cz"
                          className="text-xl text-white hover:opacity-60 transition-opacity"
                      >
                        info@galeriekroca.cz
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-[#2a2a2a] border-l-2 border-white hover:bg-[#333333] transition-all">
                    <div className="mt-1 text-white">
                      <MapPin className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">Umístění</p>
                      <p className="text-xl text-white">
                        <a href="https://maps.app.goo.gl/ShMh1MsrBwJMhCSe9">
                          Rychaltice 1, 739 46 Hukvaldy
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional info */}
              <div className="mt-12 pt-12 border-t border-gray-700 space-y-4 text-gray-400">
                <p>
                  Umělecké dědictví Antonína Kroči spravuje jeho rodina
                </p>
                <p>
                  Zastoupeno vybranými galeriemi po celé České republice
                </p>
              </div>
            </motion.div>

            {/* Right side - Image and quote */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
            >
              {/* Gallery image */}
              <div className="relative mb-12 group">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="absolute -bottom-6 -right-6 w-full h-full border border-white/20 -z-10"
                />
                <ImageWithFallback
                    src={galerie}
                    alt="Interiér galerie"
                    className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Quote box */}
              <div className="bg-white text-black p-10 relative">
                <div className="absolute top-6 left-6 text-8xl text-black/10 leading-none" aria-hidden="true">"</div>
                <blockquote className="relative z-10">
                  <p className="text-xl leading-relaxed mb-6 italic">
                    Umění není o dokonalosti, ale o pravdě. O zachycení okamžiku, kdy se duše
                    otevírá a ukazuje svou nejhlubší podstatu.
                  </p>
                  <footer className="text-sm uppercase tracking-wider text-black/70">
                    — Antonín Kroča
                  </footer>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}