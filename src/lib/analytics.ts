export function initAnalytics() {
  const token = import.meta.env.VITE_CF_BEACON_TOKEN;
  if (!token) {
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.dataset.cfBeacon = JSON.stringify({ token });
  document.head.appendChild(script);
}
