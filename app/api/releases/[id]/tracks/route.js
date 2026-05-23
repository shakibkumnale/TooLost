import { fetchTooLost } from '@/lib/toolost-api';

export async function GET(request, { params }) {
  try {
    const response = await fetchTooLost(`/releases/${params.id}/tracks`);
    if (!response.ok) {
      const err = await response.text();
      return Response.json({ message: err }, { status: response.status });
    }
    return Response.json(await response.json());
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const response = await fetchTooLost(`/releases/${params.id}/tracks`, {
      method: 'POST',
      body,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return Response.json(err, { status: response.status });
    }
    return Response.json(await response.json());
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
