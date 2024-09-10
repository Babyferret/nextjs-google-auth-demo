import PocketBase from "pocketbase";

export async function POST(req) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API_URL)

    const { email, password, passwordConfirm } = await req.json();

    try {
        const result = await pb.collection('users').create({
            email,
            password,
            passwordConfirm,
        })
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        console.log(error.data)
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

}