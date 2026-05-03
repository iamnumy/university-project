const pkr = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
});

export const formatPKR = (n) => pkr.format(Number(n) || 0);
