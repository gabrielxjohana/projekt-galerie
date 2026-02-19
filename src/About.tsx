import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import mlady from './photos/mlady3.jpeg';
import actual from './photos/actual1.jpg';


export function About() {
  return (
      <section id="about" className="py-24 md:py-32 bg-black relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Left: Image section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative overflow-hidden"
            >
              <div className="relative group">
                <div className="absolute -top-6 -left-6 w-full h-full border border-white/20 -z-10" />

                {/* Hover image switch */}
                <div className="relative w-full h-[500px] group">
                  {/* Výchozí obrázek (actual) */}
                  <ImageWithFallback
                      src={actual}
                      alt="Antonín Kroča v ateliéru"
                      className="w-full h-full object-cover transition-opacity duration-700 opacity-100 group-hover:opacity-0"
                  />

                  {/* Hover obrázek (mlady) */}
                  <ImageWithFallback
                      src={mlady}
                      alt="Mladý Antonín Kroča"
                      className="w-full h-full object-cover absolute inset-0 transition-opacity duration-[1500ms] opacity-0 group-hover:opacity-100 object-[center_30%]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right: Text section */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
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
                    className="inline-flex items-center gap-3 mb-6"
                >
                  <div className="h-px bg-white" />
                </motion.div>

                <span className="block uppercase tracking-[0.2em] text-sm text-gray-400 mb-6">
                O umělci
              </span>

                <h2 className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-8 text-white">
                  Antonín Kroča
                </h2>
              </div>

              {/* Bio text */}
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Antonín Kroča (21. října 1947 – 15. listopadu 2025)</strong> byl významný český neoexpresionistický malíř,
                  jehož dílo se vyznačovalo intenzivním ponořením do lidských emocí a zkušeností.
                </p>
              <p>
                V jeho obrazech hraje důležitou roli práce s barvou, strukturou a gestem, které neslouží pouze jako vizuální efekt, ale jako prostředek sdělení.
                Jeho tvorba je osobní, intuitivní a často reflektuje existenciální témata, mezilidské vztahy i psychologickou hloubku postav.
                Kroča se nesnaží o líbivost, ale o autentický výraz a otevřený dialog s divákem.
              </p>
                <p className="text-white/80 leading-relaxed">
                  Jeho díla jsou zastoupena v prestižních českých sbírkách, včetně{" "}
                  Národní galerie v Praze, Galerie výtvarného umění v Ostravě a Západočeské galerie v Plzni.
                </p>
              </div>

              {/* Family note */}
              <div className="mt-12 pl-8 border-l-2 border-white">
                <p className="text-gray-400 italic leading-relaxed">
                  Kročovo umělecké dědictví spravuje jeho rodina, která se věnuje zachování a
                  prezentaci jeho životního díla.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}