import { fetchTooLost } from '@/lib/toolost';

export async function POST(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const response = await fetchTooLost(`/releases/${id}/submit`, {
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
    console.error(`Error submitting release ${id}:`, err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
