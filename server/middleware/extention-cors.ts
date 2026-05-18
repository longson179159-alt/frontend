// Run this middleware before the actual API handler.
export default defineEventHandler((event) => {
  // Read the browser's Origin header. Extension requests send chrome-extension://<id> here.
  const origin = getHeader(event, "origin") || "";
  // Read the current request path, for example /api/me/.
  const path = getRequestURL(event).pathname;

  // Skip this middleware for non-API routes.
  if (!path.startsWith("/api/")) {
    return;
  }

  // This is the only extension origin we want to allow.
  const allowedOrigin = "chrome-extension://papdegnelfiiohhlondecijpinfppdgp";

  // Ignore requests that do not come from your extension.
  if (origin !== allowedOrigin) {
    return;
  }

  // Tell the browser exactly which origin is allowed to call this API.
  setResponseHeader(event, "Access-Control-Allow-Origin", origin);
  // Allow the browser to include cookies with the request.
  setResponseHeader(event, "Access-Control-Allow-Credentials", "true");
  // List the HTTP methods your extension is allowed to use.
  setResponseHeader(event, "Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  // List the request headers the browser is allowed to send.
  setResponseHeader(
    event,
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRFToken"
  );
  // Tell caches that the response can change depending on Origin.
  setResponseHeader(event, "Vary", "Origin");

  // Reply immediately to preflight requests instead of passing them to the API proxy.
  if (getMethod(event) === "OPTIONS") {
    // 204 means success with no response body.
    setResponseStatus(event, 204);
    // Return an empty body for the preflight response.
    return "";
  }
});
