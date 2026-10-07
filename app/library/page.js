"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("전체");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    setLoading(true);

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setBooks(data || []);
    }

    setLoading(false);
  }

  async function updateBookStatus(bookId, newStatus) {
    const { error } = await supabase
      .from("books")
      .update({ status: newStatus })
      .eq("id", bookId);

    if (error) {
      console.error(error);
      alert("상태 변경에 실패했습니다.");
      return;
    }

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId
          ? { ...book, status: newStatus }
          : book
      )
    );
  }

  async function deleteBook(bookId) {
    const ok = confirm("이 책을 내 서재에서 삭제할까요?");

    if (!ok) return;

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", bookId);

    if (error) {
      console.error(error);
      alert("삭제에 실패했습니다.");
      return;
    }

    setBooks((currentBooks) =>
      currentBooks.filter((book) => book.id !== bookId)
    );
  }

  const filteredBooks =
    filter === "전체"
      ? books
      : books.filter((book) => book.status === filter);

  const total = books.length;
  const reading = books.filter(
    (book) => book.status === "읽는 중"
  ).length;
  const finished = books.filter(
    (book) => book.status === "읽은 책"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold text-slate-900">
            📚 BOOKLOG
          </a>

          <a
            href="/"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            🔍 책 검색
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            MY LIBRARY
          </p>

          <h1 className="text-4xl font-bold text-slate-900">
            내 서재
          </h1>

          <p className="mt-3 text-slate-500">
            내가 저장한 책을 한눈에 관리해보세요.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">전체 책</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {total}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">읽는 중</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {reading}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">읽은 책</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {finished}
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {["전체", "읽고 싶은 책", "읽는 중", "읽은 책"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                  filter === status
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
            책을 불러오는 중...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <div className="text-5xl">📚</div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              아직 책이 없어요
            </h2>

            <p className="mt-2 text-slate-500">
              책을 검색해서 내 서재에 추가해보세요.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
            >
              책 검색하러 가기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="flex h-64 items-center justify-center bg-slate-100 p-5">
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="h-full max-w-full object-contain shadow-md"
                    />
                  ) : (
                    <div className="text-5xl">📖</div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="line-clamp-2 font-bold text-slate-900">
                    {book.title}
                  </h2>

                  <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                    {book.authors?.join(", ") || "저자 정보 없음"}
                  </p>

                  <select
                    value={book.status || "읽고 싶은 책"}
                    onChange={(event) =>
                      updateBookStatus(
                        book.id,
                        event.target.value
                      )
                    }
                    className="mt-4 w-full rounded-xl border bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="읽고 싶은 책">
                      📕 읽고 싶은 책
                    </option>
                    <option value="읽는 중">
                      📖 읽는 중
                    </option>
                    <option value="읽은 책">
                      ✅ 읽은 책
                    </option>
                  </select>

                  <button
                    onClick={() => deleteBook(book.id)}
                    className="mt-2 w-full rounded-xl border border-red-200 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    🗑️ 책 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
