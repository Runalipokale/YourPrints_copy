import type { Config } from "@netlify/functions";
import serverless from "serverless-http";
import app from "../../router/app.js";

const handler = serverless(app, { binary: ["image/*", "application/octet-stream", "application/pdf"] });

// Runs the YourPrints Express app for every request that isn't a static file
export default async (req: Request) => {
  const url = new URL(req.url);
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.from(await req.arrayBuffer());

  const multiValueQueryStringParameters: Record<string, string[]> = {};
  for (const [key, value] of url.searchParams) {
    (multiValueQueryStringParameters[key] ??= []).push(value);
  }

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const result: any = await handler(
    {
      httpMethod: req.method,
      path: url.pathname,
      headers,
      multiValueQueryStringParameters,
      body: body ? body.toString("base64") : undefined,
      isBase64Encoded: Boolean(body),
    },
    {},
  );

  const responseHeaders = new Headers();
  for (const [key, value] of Object.entries(result.headers ?? {})) {
    responseHeaders.set(key, String(value));
  }
  for (const [key, values] of Object.entries(result.multiValueHeaders ?? {})) {
    responseHeaders.delete(key);
    for (const value of values as string[]) responseHeaders.append(key, String(value));
  }

  const responseBody = result.isBase64Encoded ? Buffer.from(result.body, "base64") : result.body;
  const noBody = req.method === "HEAD" || [204, 304].includes(result.statusCode);

  return new Response(noBody ? null : responseBody, {
    status: result.statusCode,
    headers: responseHeaders,
  });
};

export const config: Config = {
  path: "/*",
  preferStatic: true,
};
