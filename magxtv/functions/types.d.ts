type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
  params: Record<string, string | undefined>;
}) => Response | Promise<Response>;

