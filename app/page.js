"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
async function saveBook(book) {
  try {
    const { error } = await supabase
      .from("books")
      .insert({
        google_id: book.googleId,
        title: book.title,
        authors: book.authors,
        publisher: book.publisher,
        published_date: book.publishedDate,
        description: book.description,
        thumbnail: book.thumbnail,
        categories: book.categories,
        page_count: book.pageCount,
        preview_link: book.previewLink,
        status: "읽고 싶은 책",
        memo: "",
      });

    if (error) {
      if (error.code === "23505") {
        alert("이미 내 책장에 있는 책입니다.");
      } else {
        console.error(error);
        alert("책 저장에 실패했습니다.");
      }

      return;
    }

    alert("📚 내 책장에 책이 추가되었습니다!");
  } catch (error) {
    console.error(error);
    alert("저장 중 오류가 발생했습니다.");
  }
}


    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const response = await fetch(
        `/api/books?q=${encodeURIComponent(search)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "검색에 실패했습니다.");
      }

      setBooks(data.books || []);

      if (!data.books || data.books.length === 0) {
        setError("검색 결과가 없습니다.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      searchBooks();
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] text-[#20242D]">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#20242D] text-xl">
              📚
            </div>

            <div>
              <h1 className="text-xl font-bold">
                BOOKLOG
              </h1>

              <p className="text-xs text-gray-500">
                나만의 독서 기록
              </p>
            </div>
          </div>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#" className="text-gray-900">
              홈
            </a>

            <a href="#search" className="text-gray-500 hover:text-gray-900">
              책 검색
            </a>

            <a href="#bookshelf" className="text-gray-500 hover:text-gray-900">
              내 책장
            </a>
          </nav>

        </div>
      </header>


      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">

        <div className="max-w-3xl">

          <p className="mb-4 text-sm font-semibold text-indigo-600">
            MY READING SPACE
          </p>

          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            읽은 책을 기록하고,
            <br />
            다음 책을 찾아보세요.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            BOOKLOG는 책을 검색하고 나만의 독서 기록을
            관리할 수 있는 개인 독서 관리 서비스입니다.
          </p>


          {/* Search */}
          <div
            id="search"
            className="mt-10 flex max-w-2xl gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
          >

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="책 제목이나 저자를 검색해보세요"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />

            <button
              onClick={searchBooks}
              disabled={loading}
              className="rounded-xl bg-[#20242D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "검색 중..." : "검색"}
            </button>

          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

        </div>
      </section>


      {/* Search Results */}
      {books.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">

          <div className="mb-6">
            <h3 className="text-2xl font-bold">
              검색 결과
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              총 {books.length}개의 책을 찾았습니다.
            </p>
          </div>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {books.map((book) => (

              <article
                key={book.googleId}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex h-72 items-center justify-center bg-gray-100">

                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-5xl">
                      📖
                    </span>
                  )}

                </div>


                <div className="p-5">

                  <h4 className="line-clamp-2 font-bold">
                    {book.title}
                  </h4>

                  <p className="mt-2 line-clamp-1 text-sm text-gray-500">
                    {book.authors?.join(", ") || "저자 정보 없음"}
                  </p>

                  {book.publishedDate && (
                    <p className="mt-1 text-xs text-gray-400">
                      {book.publishedDate}
                    </p>
                  )}

                  <button
                   onClick={() => saveBook(book)}
                   className="mt-5 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold transition hover:bg-gray-50 hover:border-gray-400"
                  >
                    📚 내 책장에 추가
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>
      )}


      {/* Statistics */}
      <section
        id="bookshelf"
        className="mx-auto max-w-6xl px-6 pb-16"
      >

        <div className="grid gap-4 md:grid-cols-3">

          <StatCard
            title="전체 책"
            value="0"
            description="내 책장에 저장한 책"
          />

          <StatCard
            title="읽는 중"
            value="0"
            description="현재 읽고 있는 책"
          />

          <StatCard
            title="읽은 책"
            value="0"
            description="완독한 책"
          />

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-gray-400">
          © 2026 BOOKLOG · Personal Reading Management Service
        </div>

      </footer>

    </main>
  );
}


function StatCard({ title, value, description }) {

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        {description}
      </p>

    </div>
  );
}

