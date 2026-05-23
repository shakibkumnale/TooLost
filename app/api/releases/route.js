import { fetchTooLost } from '@/lib/toolost-api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiPath = `/releases?${searchParams.toString()}`;
    const response = await fetchTooLost(apiPath);
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ message: errorText || 'Failed to list releases' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error('Error listing releases:', err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetchTooLost('/releases', {
      method: 'POST',
      body: body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error('Error creating release:', err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
