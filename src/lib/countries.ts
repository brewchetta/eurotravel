/** European countries a recommendation can be filed under, with the ISO codes the `destinations` table stores. */
export interface Country {
  name: string;
  /** ISO 3166-1 alpha-2. */
  code: string;
  /** ISO 4217. */
  currency: string;
}

export const COUNTRIES: readonly Country[] = [
  { name: "Albania", code: "AL", currency: "ALL" },
  { name: "Andorra", code: "AD", currency: "EUR" },
  { name: "Austria", code: "AT", currency: "EUR" },
  { name: "Belgium", code: "BE", currency: "EUR" },
  { name: "Bosnia and Herzegovina", code: "BA", currency: "BAM" },
  { name: "Bulgaria", code: "BG", currency: "EUR" },
  { name: "Croatia", code: "HR", currency: "EUR" },
  { name: "Cyprus", code: "CY", currency: "EUR" },
  { name: "Czechia", code: "CZ", currency: "CZK" },
  { name: "Denmark", code: "DK", currency: "DKK" },
  { name: "Estonia", code: "EE", currency: "EUR" },
  { name: "Finland", code: "FI", currency: "EUR" },
  { name: "France", code: "FR", currency: "EUR" },
  { name: "Germany", code: "DE", currency: "EUR" },
  { name: "Greece", code: "GR", currency: "EUR" },
  { name: "Hungary", code: "HU", currency: "HUF" },
  { name: "Iceland", code: "IS", currency: "ISK" },
  { name: "Ireland", code: "IE", currency: "EUR" },
  { name: "Italy", code: "IT", currency: "EUR" },
  { name: "Latvia", code: "LV", currency: "EUR" },
  { name: "Liechtenstein", code: "LI", currency: "CHF" },
  { name: "Lithuania", code: "LT", currency: "EUR" },
  { name: "Luxembourg", code: "LU", currency: "EUR" },
  { name: "Malta", code: "MT", currency: "EUR" },
  { name: "Moldova", code: "MD", currency: "MDL" },
  { name: "Monaco", code: "MC", currency: "EUR" },
  { name: "Montenegro", code: "ME", currency: "EUR" },
  { name: "Netherlands", code: "NL", currency: "EUR" },
  { name: "North Macedonia", code: "MK", currency: "MKD" },
  { name: "Norway", code: "NO", currency: "NOK" },
  { name: "Poland", code: "PL", currency: "PLN" },
  { name: "Portugal", code: "PT", currency: "EUR" },
  { name: "Romania", code: "RO", currency: "RON" },
  { name: "San Marino", code: "SM", currency: "EUR" },
  { name: "Serbia", code: "RS", currency: "RSD" },
  { name: "Slovakia", code: "SK", currency: "EUR" },
  { name: "Slovenia", code: "SI", currency: "EUR" },
  { name: "Spain", code: "ES", currency: "EUR" },
  { name: "Sweden", code: "SE", currency: "SEK" },
  { name: "Switzerland", code: "CH", currency: "CHF" },
  { name: "Türkiye", code: "TR", currency: "TRY" },
  { name: "Ukraine", code: "UA", currency: "UAH" },
  { name: "United Kingdom", code: "GB", currency: "GBP" },
  { name: "Vatican City", code: "VA", currency: "EUR" },
];

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
