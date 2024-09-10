import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(req) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API_URL)
    const authData = await req.json()
    try {
        pb.authStore.save(authData.token, { id: authData.record.id })

        const response = NextResponse.json({ message: 'Auth Successful' }, { status: 200 });
        response.cookies.set('pb_auth', pb.authStore.token, { path: '/', httpOnly: true });
        return response;
    } catch (error) {
        console.log(error.data)
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

}