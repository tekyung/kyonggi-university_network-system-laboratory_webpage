// 공통 상수 및 데이터
export const labInfo = {
  name: "Network System Laboratory",
  nameKorean: "네트워크 시스템 연구실",
  affiliation: "경기대학교",
  address: "경기도 수원시 영통구 광교산로 154-42 경기대학교 8강의동 8506호",
  phone: "031-249-9662",
  professor: "김남기 (Namgi Kim)",
  email: "ngkim@kyonggi.ac.kr",
};

// 섹션 제목 컴포넌트
export const SectionTitle = ({ children, align = "text-center" }) => (
  <div className={`mb-12 ${align}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
      {children}
    </h2>
    {/*<div className={`h-1.5 w-20 bg-blue-600 rounded-full ${align === "text-center" ? "mx-auto" : ""}`} />*/}
  </div>
);

// 연구 분야 데이터 (About 페이지용)
export const researchFields = [
  {
    id: 1,
    title: "AI & Data Analysis",
    desc: "최신 딥러닝 모델(LLM, YOLO)을 활용한 객체 탐지 및 빅데이터 분석",
    icon: "🤖",
    keywords: ["Deep Learning", "LLM", "Data Mining"],
  },
  {
    id: 2,
    title: "Network & IoT",
    desc: "SDN/NFV 차세대 네트워크 기술 및 IoT 센서 데이터 처리 최적화",
    icon: "🌐",
    keywords: ["SDN", "IoT", "Edge Computing"],
  },
  {
    id: 3,
    title: "Game & Interactive",
    desc: "Unity/Unreal 엔진 기반의 게임 개발 및 멀티모달 인터랙티브 시스템",
    icon: "🎮",
    keywords: ["Unity", "Metaverse", "HCI"],
  },
];

// 연구실 혜택 데이터 (Recruit 섹션용)
export const labBenefits = [
  {
    title: "등록금 & 생활비 지원",
    desc: "BK21 및 산학 과제 참여를 통한 등록금 전액 지원 및 매월 생활비 지급",
  },
  {
    title: "국내외 학회 참여",
    desc: "제주도 및 해외 주요 학회 논문 발표 시 여비 전액 지원",
  },
  {
    title: "최신 연구 장비",
    desc: "1인 1 고성능 GPU 워크스테이션 및 듀얼 모니터, 연구용 노트북 지급",
  },
  {
    title: "자유로운 분위기",
    desc: "코어 타임 없는 자율 출퇴근제, 수평적인 연구실 문화 지향",
  },
];