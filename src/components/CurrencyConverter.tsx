import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Common currencies with South African Rand as base
const currencies = [
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

// Fixed exchange rates (ZAR as base = 1)
// Note: In production, these should be fetched from a real API like exchangerate-api.com or similar
// Last updated: January 2026 (approximate rates for demonstration purposes)
// These are static rates and should be replaced with live API calls in production
const exchangeRates: Record<string, number> = {
  ZAR: 1,
  USD: 0.053,
  EUR: 0.049,
  GBP: 0.042,
  AUD: 0.082,
  CAD: 0.074,
  JPY: 7.85,
  CNY: 0.38,
  INR: 4.51,
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('ZAR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<string>('0');

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setConvertedAmount('0');
      return;
    }

    // Convert to ZAR first, then to target currency
    const amountInZAR = amountNum / exchangeRates[fromCurrency];
    const result = amountInZAR * exchangeRates[toCurrency];
    setConvertedAmount(result.toFixed(2));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const fromSymbol = currencies.find(c => c.code === fromCurrency)?.symbol || '';
  const toSymbol = currencies.find(c => c.code === toCurrency)?.symbol || '';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>
          Convert between major currencies. Rates are approximate and for reference only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Amount</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1"
              min="0"
              step="0.01"
            />
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={swapCurrencies}
            className="rounded-full"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Converted Amount</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={convertedAmount}
              readOnly
              className="flex-1 bg-muted"
            />
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result Display */}
        <div className="p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Conversion Result</p>
          <p className="text-2xl font-bold text-foreground">
            {fromSymbol}{amount} = {toSymbol}{convertedAmount}
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Exchange rates are approximate and may vary. For accurate rates, please check with your financial institution.
        </p>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
