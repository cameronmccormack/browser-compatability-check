const VENDOR_PREFIXES = ['-moz-', '-webkit-', '-o-', '-ms-'];

export const hasVendorPrefix = (identifier: string): boolean =>
  VENDOR_PREFIXES.some((prefix) => identifier.startsWith(prefix));
