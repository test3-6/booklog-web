"use client";

import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

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
              <h1 className="text-xl font-bold tracking-tight">
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
            <a href="#" className="text-gray-500 hover:text-gray-900">
              책 검색
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
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
          <div className="mt-10 flex max-w-2xl gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="책 제목이나 저자를 검색해보세요"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />

            <button
              className="rounded-xl bg-[#20242D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              onClick={() => alert(`검색어: ${search}`)}
            >
              검색
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
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

      {/* Recent Books */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold">
              최근 독서 기록
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              아직 등록된 책이 없습니다.
            </p>
          </div>

          <button className="text-sm font-semibold text-indigo-600">
            전체 보기 →
          </button>
        </div>

        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
            📖
          </div>

          <h4 className="font-semibold">
            첫 번째 책을 추가해보세요
          </h4>

          <p className="mt-2 text-sm text-gray-500">
            책을 검색하면 이곳에 독서 기록이 표시됩니다.
          </p>

          <button className="mt-6 rounded-xl bg-[#20242D] px-5 py-3 text-sm font-semibold text-white">
            책 검색하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-gray-400">
          © 2026 BOOKLOG. Personal Reading Management Service.
        </div>
      </footer>
    </main>
  );
}

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}
