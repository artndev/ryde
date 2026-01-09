import { neon } from '@neondatabase/serverless'

export const POST = async (req: Request) => {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { username, email, clerkId } = await req.json()

    if (!username || !email || !clerkId) {
      return Response.json(
        {
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const res = await sql`
    INSERT INTO users (
        username,
        email,
        clerk_id
    )
    VALUES (
        ${username},
        ${email},
        ${clerkId}
    )
  `

    return new Response(JSON.stringify({ data: res }), { status: 201 })
  } catch (err) {
    console.log(err)

    return Response.json({ error: err }, { status: 500 })
  }
}
