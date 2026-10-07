import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (!q) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Books API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const googleUrl =
      "https://www.googleapis.com/books/v1/volumes" +
      `?q=${encodeURIComponent(q)}` +
      "&maxResults=12" +
      `&key=${apiKey}`;

    const response = await fetch(googleUrl, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.error?.message ||
            "Google Books 검색에 실패했습니다.",
        },
        { status: response.status }
      );
    }

    const books = (data.items || []).map((item) => {
      const info = item.volumeInfo || {};

      return {
        googleId: item.id,
        title: info.title || "제목 없음",
        authors: info.authors || [],
        publisher: info.publisher || "",
        publishedDate: info.publishedDate || "",
        description: info.description || "",
        thumbnail:
          info.imageLinks?.thumbnail?.replace(
            "http://",
            "https://"
          ) || "",
        categories: info.categories || [],
        pageCount: info.pageCount || null,
        previewLink: info.previewLink || "",
      };
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Google Books API 오류:", error);

    return NextResponse.json(
      { error: "책 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
