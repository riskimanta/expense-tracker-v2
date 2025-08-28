export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number // Rate to IDR (base currency)
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.000065 }, // 1 USD = 15,384 IDR
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.000060 }, // 1 EUR = 16,667 IDR
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 0.000088 }, // 1 SGD = 11,364 IDR
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 0.0098 }, // 1 JPY = 102 IDR
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 0.00047 }, // 1 CNY = 2,128 IDR
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.000052 }, // 1 GBP = 19,231 IDR
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 0.00010 }, // 1 AUD = 10,000 IDR
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.000089 }, // 1 CAD = 11,236 IDR
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.000072 }, // 1 CHF = 13,889 IDR
]

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code)
}

export const getDefaultCurrency = (): Currency => {
  return SUPPORTED_CURRENCIES[0] // IDR
}

export const convertToIDR = (amount: number, currencyCode: string): number => {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return amount // Default to IDR if currency not found
  
  return amount / currency.rate
}

export const convertFromIDR = (amountIDR: number, currencyCode: string): number => {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return amountIDR // Default to IDR if currency not found
  
  return amountIDR * currency.rate
}

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return formatIDR(amount)
  
  if (currency.code === 'IDR') {
    return formatIDR(amount)
  }
  
  // Format other currencies
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return formattedAmount
}

export const formatID = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

export const onlyDigits = (s: string) => s.replace(/\D+/g, "");

export const toNumberFromMasked = (s: string): number => {
  const d = onlyDigits(s);
  return d ? parseInt(d, 10) : 0;
};

// Additional utility functions for currency handling
export const formatIDR = (n: number) => `Rp ${formatID(n)}`;

export const parseCurrencyInput = (input: string): { display: string; value: number } => {
  const cleanValue = onlyDigits(input);
  const numValue = cleanValue ? parseInt(cleanValue, 10) : 0;
  const displayValue = numValue > 0 ? formatID(numValue) : '';
  
  return {
    display: displayValue,
    value: numValue
  };
};

export const createCurrencyInputHandler = (
  setDisplay: (value: string) => void,
  setValue: (value: number) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const { display, value } = parseCurrencyInput(inputValue);
    
    setDisplay(display);
    setValue(value);
  };
};

export const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
  const from = getCurrencyByCode(fromCurrency)
  const to = getCurrencyByCode(toCurrency)
  
  if (!from || !to) return 1
  
  // Convert through IDR
  return to.rate / from.rate
}

export const calculateTotalInIDR = (transactions: Array<{ amount: number; currency: string }>): number => {
  return transactions.reduce((total, transaction) => {
    return total + convertToIDR(transaction.amount, transaction.currency)
  }, 0)
}

export const validateCurrencyCode = (code: string): boolean => {
  return SUPPORTED_CURRENCIES.some(currency => currency.code === code)
}

export const getCurrencyOptions = () => {
  return SUPPORTED_CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
    symbol: currency.symbol
  }))
}
