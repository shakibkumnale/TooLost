import { fetchTooLost } from '@/lib/toolost';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const response = await fetchTooLost('/platforms');
    if (!response.ok) return Response.json({ data: [] }, { status: response.status });
    return Response.json(await response.json());
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
