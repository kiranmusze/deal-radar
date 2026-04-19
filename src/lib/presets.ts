import { PresetQuery } from './types';

export const PRESET_QUERIES: PresetQuery[] = [
  // Kategorie 1: Klassische Nachfolge
  {
    label: 'Der stille Mittelständler',
    query: 'Inhabergeführte GmbHs in Bayern, Maschinenbau, Inhaber 65+, Umsatz 1-5 Mio. EUR',
    category: 'Nachfolge',
  },
  {
    label: 'NRW Nachfolge-Pipeline',
    query: 'GmbHs in NRW, inhabergeführt, Inhaber über 60, 10-50 Mitarbeiter',
    category: 'Nachfolge',
  },
  {
    label: 'Handwerks-Veteranen',
    query: 'Handwerksbetriebe und Bau-GmbHs, Inhaber über 62, unter 30 Mitarbeiter, schuldenfrei',
    category: 'Nachfolge',
  },

  // Kategorie 2: Financial Engineering
  {
    label: 'Eigenkapital-Riesen',
    query: 'GmbHs mit Eigenkapital über 500.000 EUR, Umsatz unter 3 Mio., Inhaber 60+',
    category: 'Financial',
  },
  {
    label: 'Cash Cows ohne Nachfolger',
    query: 'Profitable GmbHs mit positivem Nettoergebnis, inhabergeführt, Inhaber 65+, unter 50 MA',
    category: 'Financial',
  },
  {
    label: 'Schuldenfreie Veteranen',
    query: 'GmbHs ohne oder mit geringen Verbindlichkeiten, Inhaber 60+, Umsatz 500k-3 Mio.',
    category: 'Financial',
  },

  // Kategorie 3: Sektor-Spezifisch
  {
    label: 'Healthcare Hidden Champions',
    query: 'Unternehmen im Gesundheitswesen (WZ 86-88), GmbH, inhabergeführt, Inhaber 58+',
    category: 'Sektor',
  },
  {
    label: 'B2B Software ohne VC',
    query: 'IT-Dienstleister und Softwareunternehmen, GmbH, inhabergeführt, 5-30 MA, Inhaber 55+',
    category: 'Sektor',
  },
  {
    label: 'Logistik-Perlen',
    query: 'Logistik- und Transportunternehmen, GmbH, inhabergeführt, Inhaber 60+, 20-100 MA',
    category: 'Sektor',
  },

  // Kategorie 4: Kontraintuitiv
  {
    label: 'Zombie-Unternehmen',
    query: 'GmbHs mit stagnierendem Umsatz unter 1 Mio., inhabergeführt, Inhaber über 65, unter 10 MA',
    category: 'Kontraintuitiv',
  },
  {
    label: 'Einmann-Imperien',
    query: 'GmbHs mit Einzelgesellschafter, 0-2 Mitarbeiter, Umsatz über 500.000 EUR, Inhaber 60+',
    category: 'Kontraintuitiv',
  },
  {
    label: 'Das 1990er-Portfolio',
    query: 'GmbHs gegründet zwischen 1990 und 1995, inhabergeführt, Inhaber heute 58-68',
    category: 'Kontraintuitiv',
  },

  // Kategorie 5: Geo-Specials
  {
    label: 'Ruhrgebiet Revival',
    query: 'Inhabergeführte GmbHs in Essen, Dortmund, Duisburg, Bochum, Inhaber 60+, Maschinenbau oder Metall',
    category: 'Geo',
  },
  {
    label: 'Ostdeutschland-Chance',
    query: 'GmbHs in Sachsen, Thüringen, Brandenburg, gegründet 1990-2000, inhabergeführt, Inhaber 58+',
    category: 'Geo',
  },
  {
    label: 'Süddeutscher Mittelstand',
    query: 'GmbHs in Bayern und Baden-Württemberg, Maschinenbau oder Automotive, 20-80 MA, Inhaber 62+',
    category: 'Geo',
  },
];
