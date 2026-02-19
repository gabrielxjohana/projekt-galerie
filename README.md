# Galerie Antonína Kroči

Moderní webová prezentace pro galerii českého neoexpresionistického malíře Antonína Kroči (1947–2025).

## 🎨 Funkce

- **Responzivní design** - Plně optimalizované pro desktop, tablet i mobil
- **Plynulé animace** - Motion animace s Framer Motion
- **Interaktivní galerie** - Bento grid layout s lightbox modal
- **Moderní technologie** - React, TypeScript, Tailwind CSS, Vite

## 🚀 Instalace

### Požadavky
- Node.js 18+ 
- npm nebo yarn

### Kroky

1. **Nainstaluj závislosti:**
```bash
npm install
```

2. **Spusť vývojový server:**
```bash
npm run dev
```

3. **Otevři v prohlížeči:**
```
http://localhost:5173
```

## 📦 Build pro produkci

```bash
npm run build
```

Build vytvoří optimalizované soubory v adresáři `dist/`.

Preview buildu:
```bash
npm run preview
```

## 🛠️ Technologie

- **React 18** - UI knihovna
- **TypeScript** - Type-safe JavaScript
- **Vite** - Rychlý build nástroj
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animační knihovna
- **Lucide React** - Ikony

## 📂 Struktura projektu

```
/
├── src/
│   ├── components/
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   ├── App.tsx              # Hlavní komponenta
│   ├── Header.tsx           # Navigace
│   ├── Hero.tsx             # Hero sekce
│   ├── About.tsx            # O umělci
│   ├── Gallery.tsx          # Galerie děl
│   ├── Contact.tsx          # Kontaktní sekce
│   ├── Footer.tsx           # Patička
│   ├── globals.css          # Globální styly
│   └── main.tsx             # Vstupní bod
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Hlavní sekce

### Header
- Sticky navigace s plynulým scrollováním
- Mobilní hamburger menu
- Transparentní pozadí s blur efektem

### Hero
- Fullscreen hero sekce s background obrázkem
- Animované nadpisy s Motion
- Scroll indikátor

### About
- Grid layout s obrázkem a textem
- Hover efekty na obrázku (grayscale → color)
- Responzivní design

### Gallery
- Bento grid layout (4 sloupce na desktopu)
- Custom cursor s zoom ikonou
- Lightbox modal s detaily díla
- Animace při vstupu do viewport

### Contact
- Kontaktní informace
- Citát umělce
- Obrázek galerie

### Footer
- Informace o umělci
- Rychlé odkazy
- Copyright

## 🎨 Customizace

### Barvy
Upravte CSS proměnné v `src/globals.css`:
```css
:root {
  --accent-primary: #2C2C2C;
  --accent-secondary: #5A5A5A;
  --accent-light: #8A8A8A;
}
```

### Díla v galerii
Upravte pole `artworks` v `src/Gallery.tsx`:
```typescript
const artworks = [
  {
    id: 1,
    title: "Název díla",
    year: "2018",
    dimensions: "120 × 100 cm",
    medium: "Olej na plátně",
    image: "URL_OBRAZKU",
    span: "md:col-span-2 md:row-span-2"
  },
  // ...
];
```

### Obrázky
Nahraďte URL obrázků ve všech komponentách vlastními obrázky.

## 📱 Responzivita

Aplikace je plně responzivní:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Možné úpravy

1. **Přidat vyhledávání v galerii**
2. **Přidat filtrování podle roku/techniky**
3. **Přidat blog sekci**
4. **Integrace s CMS (Sanity, Contentful)**
5. **Přidat kontaktní formulář s emailem**
6. **SEO optimalizace**
7. **Analytics (Google Analytics, Plausible)**

## 📄 Licence

Tento projekt je vytvořen jako šablona pro prezentaci uměleckého díla.

## 👤 Autor

Vytvořeno na základě Figma designu.
