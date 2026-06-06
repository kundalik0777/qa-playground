const BLOCKED_DOMAINS = [
  // Generic test/placeholder domains
  "test.com", "test.org", "test.net",
  "example.com", "example.org", "example.net",
  "fake.com", "fake.org", "fake.net",
  "sample.com", "sample.org",
  "demo.com", "demo.org",
  "placeholder.com",
  "invalid.com",
  "noemail.com",
  "nope.com",
  "notreal.com",
  "nowhere.com",
  // Disposable / throwaway email services
  "mailinator.com",
  "guerrillamail.com", "guerrillamail.org", "guerrillamail.net", "guerrillamail.info",
  "grr.la", "sharklasers.com", "guerrillamailblock.com", "spam4.me",
  "yopmail.com", "yopmail.fr",
  "10minutemail.com", "10minutemail.net", "10minutemail.org",
  "tempmail.com", "tempmail.net", "tempmail.org",
  "throwaway.email",
  "maildrop.cc",
  "trashmail.com", "trashmail.net", "trashmail.org", "trashmail.at", "trashmail.me",
  "dispostable.com",
  "discard.email",
  "mailnull.com",
  "spamgourmet.com",
  "spamdecoy.net",
  "0-mail.com",
  "getairmail.com",
  "filzmail.com",
  "spamfree24.org",
  "spammotel.com",
  "tempr.email",
  "anonaddy.com",
  "burnermail.io",
  "emailondeck.com",
  "fakeinbox.com",
  "tempinbox.com",
  "mailtemp.info",
  "getnada.com",
  "spamgrap.com",
];

export function isBlockedDomain(email) {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? BLOCKED_DOMAINS.includes(domain) : false;
}
