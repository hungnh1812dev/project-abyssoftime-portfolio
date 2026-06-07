import xregexp from "xregexp";

export function createRegex(patternString: string) {
  return xregexp(patternString);
}
