export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json(
      { error: "검색어를 입력해주세요." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Google Books API Key가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const url =
      `https://www.googleapis.com/books/v1/volumes` +
      `?q=${encodeURIComponent(query)}` +
      `&maxResults=20` +
      `&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      return Response.json(
        { error: "Google Books API 요청에 실패했습니다." },
        { status: response.status }
      );
    }

    const data = await response.json();

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
          info.imageLinks?.thumbnail ||
          info.imageLinks?.smallThumbnail ||
          "",
        categories: info.categories || [],
        pageCount: info.pageCount || null,
        previewLink: info.previewLink || "",
      };
    });

    return Response.json({
      books,
      totalItems: data.totalItems || 0,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "책 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
