import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { path, type, secret } = await request.json();
    if (secret !== process.env.REVALIDATION_SECRET!) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!path) {
      return NextResponse.json(
        { message: "Path is required" },
        { status: 400 }
      );
    }

    revalidatePath(path, type);

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    console.error("Error revalidating path:", err);
    return NextResponse.json(
      { message: "Error revalidating path" },
      { status: 500 }
    );
  }
}
