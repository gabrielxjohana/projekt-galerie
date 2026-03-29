import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
// @ts-ignore
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
                  <div
                      className="flex items-start gap-6 p-6 bg-[#2a2a2a] border-l-2 border-white hover:bg-[#333333] transition-all">
                    <div className="mt-1 text-white">
                      <Mail className="w-6 h-6" aria-hidden="true"/>
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
                  <div
                      className="flex items-start gap-6 p-6 bg-[#2a2a2a] border-l-2 border-white hover:bg-[#333333] transition-all">
                    <div className="mt-1 text-white">
                      <Phone className="w-6 h-6" aria-hidden="true"/>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">Telefonní číslo</p>
                      <p className="text-xl text-white">
                          +420 605 136 552
                      </p>
                    </div>
                  </div>
                </div>


                <div className="group">
                  <div
                      className="flex items-start gap-6 p-6 bg-[#2a2a2a] border-l-2 border-white hover:bg-[#333333] transition-all">
                    <div className="mt-1 text-white">
                      <MapPin className="w-6 h-6" aria-hidden="true"/>
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
                initial={{opacity: 0, x: 50}}
                whileInView={{opacity: 1, x: 0}}
                transition={{duration: 0.8}}
                viewport={{once: true}}
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
              {/* Quote box */}
              <div className="flex items-stretch overflow-hidden rounded-lg border border-white/10">
                <div className="w-1.5 bg-gray-500 flex-shrink-0" />
                <div className="bg-[#2a2a2a] px-6 py-5 flex items-start gap-4 flex-1">
                  <div className="mt-0.5 flex-shrink-0 text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="3" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                      <line x1="6" y1="1" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="14" y1="1" x2="14" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="2" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="7" cy="13" r="1.2" fill="currentColor"/>
                      <circle cx="10" cy="13" r="1.2" fill="currentColor"/>
                      <circle cx="13" cy="13" r="1.2" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-base mb-1">
                      Návštěva pouze po předchozí domluvě
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Galerie není otevřena veřejně. Kontaktujte nás pro sjednání termínu.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}