// Footer.tsx
import { scrollToSection } from "./utils/scrollToSection";

export function Footer() {
  return (
      <footer className="bg-black text-white py-16 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Column 1 - About */}
            <div>
              <h3 className="text-2xl mb-4 tracking-tight">Antonín Kroča</h3>
              <p className="text-white/60 leading-relaxed">
                Významný český neoexpresionistický malíř (1947–2025), jehož dílo se vyznačovalo intenzivním ponořením do lidských emocí.
              </p>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white/40 mb-4">Rychlé odkazy</h4>
              <ul className="space-y-3">
                <li>
                  <button
                      onClick={() => scrollToSection("about")}
                      className="text-white/60 hover:text-white transition-colors"
                  >
                    O umělci
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => scrollToSection("exhibitions")}
                      className="text-white/60 hover:text-white transition-colors"
                  >
                    Výstavy
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => scrollToSection("gallery")}
                      className="text-white/60 hover:text-white transition-colors"
                  >
                    Díla
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => scrollToSection("contact")}
                      className="text-white/60 hover:text-white transition-colors"
                  >
                    Kontakt
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white/40 mb-4">Kontakt</h4>
              <ul className="space-y-3 text-white/60">
                <li>
                  <a href="mailto:info@galeriekroca.cz" className="hover:text-white transition-colors">
                    info@galeriekroca.cz
                  </a>
                </li>
                <li>

                 <a href="https://maps.app.goo.gl/ShMh1MsrBwJMhCSe9">
                   Rychaltice 1, 739 46 Hukvaldy
                </a>
              </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© {new Date().getFullYear()} Galerie Antonína Kroči.</p>
            <p>Spravováno rodinou s láskou a úctou k umění</p>
          </div>
        </div>
      </footer>
  );
}