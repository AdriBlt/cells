/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

export function formatPercentageForCSS(percentage: number, decimalPrecision: number = 0): string {
  return formatNumber(percentage, decimalPrecision) + '%';
}

export function formatNumber(percentage: number, decimalPrecision: number = 0): number {
  const precisionFactor = Math.pow(10, decimalPrecision);
  return Math.floor(percentage * 100 * precisionFactor) / precisionFactor;
}

export function pluralizeString(
  pluralizationString: string,
  count: number,
  ...formatOtherArguments: Array<string | number>
): string {
  const pluralizedFormat = getPluralizedFormat(pluralizationString, count);
  if (formatOtherArguments) {
    const formatArguments = formatOtherArguments.map(a => a.toString());
    formatArguments.unshift(count.toString());
    return formatString(pluralizedFormat, ...formatArguments);
  } else {
    return formatString(pluralizedFormat, count.toString());
  }
}

export function getPluralizedFormat(pluralizationString: string, count: number): string {
  const pluralizationOptionRegex = /\((.*?)\){(.*?)};/g; // ex: "(7-inf){a lot of items};"
  let matches = pluralizationOptionRegex.exec(pluralizationString);
  while (matches) {
    if (isConditionFulfilled(matches[1], count)) {
      return matches[2];
    }
    matches = pluralizationOptionRegex.exec(pluralizationString);
  }
  return pluralizationString;
}

function isConditionFulfilled(conditionString: string, count: number): boolean {
  const singleValueCondition = /^-?\d+$/g; // ex: "7"
  const intervalCondition = /^(-?\d+)-(-?\d+)$/g; // ex: "7-9"
  const greaterOrEqualCondition = /^(-?\d+)-inf$/g; // ex: "7-inf"
  const inferiorOrEqualCondition = /^inf-(-?\d+)$/g; // ex: "inf-7"

  let matches = singleValueCondition.exec(conditionString);
  if (matches) {
    return count === parseInt(matches[0], 10);
  }

  matches = intervalCondition.exec(conditionString);
  if (matches) {
    return count >= parseInt(matches[1], 10) && count <= parseInt(matches[2], 10);
  }

  matches = greaterOrEqualCondition.exec(conditionString);
  if (matches) {
    return count >= parseInt(matches[1], 10);
  }

  matches = inferiorOrEqualCondition.exec(conditionString);
  if (matches) {
    return count <= parseInt(matches[1], 10);
  }

  return false;
}

export function formatString(format: string, ...args: string[]) {
  return format.replace(/{(\d+)}/g, (match, index) =>
    typeof args[index] !== 'undefined' ? args[index] : match
  );
}

export function concatLocalizedStrings(concatenationFormat: string, args: string[]): string {
  switch (args.length) {
    case 0:
      return '';
    case 1:
      return args[0];
    default:
      return formatString(
        concatenationFormat,
        args[0],
        concatLocalizedStrings(concatenationFormat, args.slice(1))
      );
  }
}

export function stripNonAlphanumericOrUnderscoreCharacters(str: string) {
  return str.replace(/\W/gi, '');
}

export function stripLeadingNumbersAndUnderscoresCharacters(str: string) {
  return str.replace(/^([0-9]|_)+/gi, '');
}

export function stripTrailingUnderscoresCharacters(str: string) {
  return str.replace(/_+$/gi, '');
}

export function squashUnderscores(str: string) {
  return str.replace(/_+/gi, '_');
}

export function replaceDashWithUnderscore(str: string) {
  return str.replace(/-/gi, '_');
}
