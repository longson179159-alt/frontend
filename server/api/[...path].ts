

export default defineEventHandler(async (event) => {


  const config = useRuntimeConfig();
  const method = getMethod(event);
  const query = getQuery(event);
  const rawPath = String(getRouterParam(event, "path") || "").replace(/^\/+/, "");

  if (!rawPath) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  const base = String(config.apiProxyBase || "").replace(/\/+$/, "");
  const upstreamUrl = `${base}/${rawPath}${rawPath.endsWith("/") ? "" : "/"}`;

  const headers: Record<string, string> = {};
  const cookie = getHeader(event, "cookie");
  const authorization = getHeader(event, "authorization");
  const contentType = getHeader(event, "content-type");
  const accept = getHeader(event, "accept");
  const csrfToken = getHeader(event, "x-csrftoken");

  if (cookie) headers.cookie = cookie;
  if (authorization) headers.authorization = authorization;
  if (contentType) headers["content-type"] = contentType;
  if (accept) headers.accept = accept;
  if (csrfToken) headers["x-csrftoken"] = csrfToken;

  const hasBody = !["GET", "HEAD"].includes(method.toUpperCase());
  const body = hasBody ? await readBody(event) : undefined;

  try {
    const upstream = await $fetch.raw(upstreamUrl, {
      method,
      query,
      headers,
      body,
    });

    const setCookies = upstream.headers.getSetCookie?.() || [];
    for (const value of setCookies) {
      appendResponseHeader(event, "set-cookie", value);
    }

    setResponseStatus(event, upstream.status, upstream.statusText);
    return upstream._data;
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const data = error?.response?._data;
    const setCookies = error?.response?.headers?.getSetCookie?.() || [];

    for (const value of setCookies) {
      appendResponseHeader(event, "set-cookie", value);
    }

    setResponseStatus(event, status);
    return data || { message: `Proxy failed for ${rawPath}` };
  }
});
