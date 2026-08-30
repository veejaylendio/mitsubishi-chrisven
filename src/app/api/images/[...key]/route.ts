import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2Bucket } from "@/lib/r2/client";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const objectKey = key.join("/");
  const range = request.headers.get("range") ?? undefined;

  try {
    const object = await getR2Client().send(
      new GetObjectCommand({ Bucket: getR2Bucket(), Key: objectKey, Range: range }),
    );
    if (!object.Body) {
      return new NextResponse(null, { status: 404 });
    }

    const headers: Record<string, string> = {
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
    };
    if (object.ContentLength !== undefined) {
      headers["Content-Length"] = String(object.ContentLength);
    }

    // R2 returns a ContentRange only when it actually honored our Range request.
    if (range && object.ContentRange) {
      headers["Content-Range"] = object.ContentRange;
      return new NextResponse(object.Body.transformToWebStream(), {
        status: 206,
        headers,
      });
    }

    return new NextResponse(object.Body.transformToWebStream(), { headers });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
