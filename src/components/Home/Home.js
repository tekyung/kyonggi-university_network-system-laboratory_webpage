import React, { useState, useEffect, Suspense, lazy } from "react";
import { labInfo } from "../../utils/constants";

const RippleShaderBackground = lazy(() => import("./RippleShaderBackground"));

const Home = ({ mainBgImage }) => {
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    // 로딩 속도 개선을 위해 3D 배경 지연 로드
    const timer = setTimeout(() => setShow3D(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToRecruit = (e) => {
    e.preventDefault();
    // About 페이지 내의 Recruit 섹션으로 이동
    const element = document.getElementById("recruit-info");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // 혹시 해당 섹션이 없으면 About 상단으로 이동
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900"
    >
      {/* 배경 레이어 */}
      <div className="absolute inset-0 z-0">
        {show3D ? (
          <Suspense fallback={<div className="w-full h-full bg-slate-900" />}>
            {/* 3D 배경의 투명도를 조절하여 텍스트 집중도 향상 (opacity-40) */}
            <div className="opacity-60 w-full h-full">
              <RippleShaderBackground imageUrl={mainBgImage} />
            </div>
          </Suspense>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center opacity-30 blur-sm transform scale-105"
            style={{ backgroundImage: `url(${mainBgImage})` }}
          />
        )}
      </div>

      {/* 오버레이 그라데이션 (텍스트 가독성 확보용) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/90 z-0 pointer-events-none"></div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* 소속 & 이름 */}
        <p className="text-blue-400 font-bold tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {labInfo.affiliation}
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Network <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            System Laboratory
          </span>
        </h1>

        {/* 핵심 연구 키워드 (직관적 전달) */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 text-gray-300 font-medium text-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <span className="px-4 py-1 border border-gray-600 rounded-full bg-slate-800/50 backdrop-blur-sm">🤖 Artificial Intelligence</span>
          <span className="px-4 py-1 border border-gray-600 rounded-full bg-slate-800/50 backdrop-blur-sm">🌐 Next-Gen Network</span>
          <span className="px-4 py-1 border border-gray-600 rounded-full bg-slate-800/50 backdrop-blur-sm">🎮 Interactive Media</span>
        </div>

        {/* CTA 버튼 그룹 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          {/* 주요 타겟(학부생)을 위한 모집 안내 버튼 */}
          <button
            onClick={scrollToRecruit}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-all transform hover:-translate-y-1 w-full md:w-auto"
          >
            대학원생/학부연구생 모집 🚀
          </button>

          {/* 일반 방문자를 위한 소개 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("publications")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium text-lg rounded-full backdrop-blur-md border border-white/30 transition-all w-full md:w-auto"
          >
            연구 성과 보기
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;