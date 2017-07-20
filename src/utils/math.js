export const round = (value, decimals) => (
  Number(Math.round(Number(`${value}e${decimals}`)) + `e-${decimals}`)
);
