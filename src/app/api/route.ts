export async function GET() {
    const data = {
        message: 'Hello from Route Handler!'
    };
    return Response.json(data);
}