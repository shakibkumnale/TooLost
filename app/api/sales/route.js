import { fetchTooLost } from '@/lib/toolost-api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'overview';
    
    // Build target API path (e.g. /sales/overview or /sales/tracks)
    const targetPath = `/sales/${endpoint}`;
    
    // Copy other query parameters
    const query = new URLSearchParams(searchParams);
    query.delete('endpoint');
    
    const apiPath = `${targetPath}?${query.toString()}`;
    const response = await fetchTooLost(apiPath);
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ message: errorText || `Failed to fetch sales ${endpoint}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error('Error fetching sales:', err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
