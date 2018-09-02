export function matchCompanyToInput(company, input) {
  // Restrict length of input to 3 letters or more to reduce load
  if (input.length > 2) {
    return (
      company.name.toLowerCase().indexOf(input.toLowerCase()) !== -1 ||
      company.ticker.toLowerCase().indexOf(input.toLowerCase()) !== -1
    );
  }
}

// Sort autocompletion suggestions
export function sortCompanies(a, b, value) {
  const aLower = a.name.toLowerCase();
  const bLower = b.name.toLowerCase();
  const valueLower = value.toLowerCase();
  const queryPosA = aLower.indexOf(valueLower);
  const queryPosB = bLower.indexOf(valueLower);
  if (queryPosA !== queryPosB) {
    return queryPosA - queryPosB;
  }
  return aLower < bLower ? -1 : 1;
}
