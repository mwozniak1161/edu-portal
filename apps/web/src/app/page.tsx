export const metadata = {
  title: 'Home',
  description: 'Educational ERP Homepage',
};

export default async function Home() {
  let apiStatus = 'Checking...';
  let apiData = null;
  let error = null;

  try {
    const res = await fetch('http://localhost:3000', {
      // Important: Disable caching during development to always get fresh data
      cache: 'no-store',
      // Include credentials if your API uses cookies for auth
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    // Try to parse as JSON, fallback to text
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      apiData = await res.json();
    } else {
      apiData = await res.text();
    }

    apiStatus = `✅ Connected (Status: ${res.status})`;
  } catch (err) {
    apiStatus = `❌ Connection Failed`;
    error = err.message;
    console.error('API Connection Error:', err);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Educational ERP
        </h1>
        <p className="text-gray-600 mb-6">
          Frontend-Backend Integration Test
        </p>

        {/* API Status Display */}
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3">
              {apiStatus.startsWith('✅') ? (
                <div className="bg-green-500 rounded-full"></div>
              ) : (
                <div className="bg-red-500 rounded-full"></div>
              )}
            </div>
            <span className="font-medium">{apiStatus}</span>
          </div>

          {apiData !== null && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">API Response:</h3>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
              <h3 className="font-semibold mb-2">Error Details:</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Development Info */}
        <div className="mt-8 text-xs text-gray-400">
          <div className="space-y-1">
            <div>Next.js Dev Server: <span className="font-mono">http://localhost:3001</span></div>
            <div>NestJS API Server: <span className="font-mono">http://localhost:3000</span></div>
            <div>Last Updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </main>
  );
}