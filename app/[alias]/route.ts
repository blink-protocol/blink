import { NextRequest, NextResponse } from "next/server";
import { resolveAlias } from "@/lib/stellar";

export async function GET(request: NextRequest, context: { params: Promise<{ alias: string }> }) {
  const { alias } = await context.params;
  const link = await resolveAlias(alias);
  if (!link?.active) return NextResponse.redirect(new URL(`/?missing=${encodeURIComponent(alias)}`, request.url));
  return NextResponse.redirect(link.destination, 307);
}

