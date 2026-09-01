import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

/**
 * POST /api/admin/upload
 *
 * Accepts multipart form data with a single "file" field.
 * Saves the image to the Railway Volume and returns the public URL.
 * Requires admin authentication.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "No file provided" },
      { status: 400 },
    );
  }

  const result = await saveUpload(file);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
