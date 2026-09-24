export async function loadBrowserConfig(): Promise<any> {
  try {
    const res: Response = await fetch('/assets/root-urls.json');
    if (!res.ok) {
      return new Error('BROWSER root-urls.json has not been found');
    }

    const rootUrls: any = await res.json();
    if (!rootUrls.rootUrlBrowser) {
      return new Error('BROWSER root-urls.json is malformed');
    }

    return rootUrls.rootUrlBrowser;

  } catch (err) {
    if (err instanceof SyntaxError) {
      return new Error('BROWSER root-urls.json is not valid JSON');
    }
  }
}
