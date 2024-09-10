import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function GET(req) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API_URL)
    try {
        pb.authStore.clear()
        const response = NextResponse.json({ message: 'Logout Successful' }, { status: 200 });
        response.cookies.delete("pb_auth")
        return response;
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

}