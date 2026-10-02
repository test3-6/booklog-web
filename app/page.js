"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchBooks() {
    if (!search.trim()) {
      setError("책 제목이나 저자를 입력해주세요.");
      return;
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
    } catch (err) {
      console.error(err);
      setError(err.message || "검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function saveBook(book) {
    try {
      const { error: saveError } = await supabase
        .from("books")
        .insert({
          google_id: book.googleId,
          title: book.title,
          authors: book.authors || [],
          publisher: book.publisher || "",
          published_date: book.publishedDate || "",
          description: book.description || "",
          thumbnail: book.thumbnail || "",
          categories: book.categories || [],
          page_count: book.pageCount || null,
          preview_link: book.previewLink || "",
          status: "읽고 싶은 책",
          memo: "",
        });

      if (saveError) {
        if (saveError.code === "23505") {
          alert("이미 내 책장에 있는 책입니다.");
        } else {
          console.error(saveError);
          alert("책 저장에 실패했습니다.");
        }
        return;
      }

      alert("책이 내 책장에 추가되었습니다!");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-xl">
              📚
            </div>

            <div>
              <h1 className="text-xl font-bold">BOOKLOG</h1>
              <p className="text-xs text-gray-500">나만의 독서 기록</p>
            </div>
          </div>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#" className="text-gray-900">
              홈
            </a>

            <a href="#search" className="text-gray-500">
              책 검색
            </a>

            <a href="#bookshelf" className="text-gray-500">
              내 책장
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold text-indigo-600">
            MY READING SPACE
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            읽은 책을 기록하고,
            <br />
            다음 책을 찾아보세요.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            BOOKLOG는 책을 검색하고 나만의 독서 기록을
            관리할 수 있는 독서 관리 서비스입니다.
          </p>

          <div
            id="search"
            className="mt-10 flex max-w-2xl gap-3 rounded-2xl border bg-white p-2 shadow-sm"
          >
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchBooks();
                }
              }}
              placeholder="책 제목이나 저자를 검색해보세요"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />

            <button
              onClick={searchBooks}
              disabled={loading}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
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

      {books.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">검색 결과</h3>

            <p className="mt-1 text-sm text-gray-500">
              총 {books.length}개의 책을 찾았습니다.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <article
                key={book.googleId}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="flex h-72 items-center justify-center bg-gray-100">
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-5xl">📖</span>
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
                    className="mt-5 w-full rounded-xl border py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    📚 내 책장에 추가
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

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

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-gray-400">
          © 2026 BOOKLOG
        </div>
      </footer>
    </main>
  );
}

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-bold">{value}</p>

      <p className="mt-2 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}
