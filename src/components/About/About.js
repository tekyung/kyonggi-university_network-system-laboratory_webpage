import React from 'react';
import { labInfo, SectionTitle, researchFields, labBenefits } from '../../utils/constants';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">

        {/* 1. 연구실 소개 Intro */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <SectionTitle>연구실 소개</SectionTitle>
          <p className="text-xl text-gray-600 leading-relaxed break-keep">
            <strong className="text-blue-900">{labInfo.name}</strong> 는 <br className="md:hidden" />
            초연결 사회를 위한 <strong>차세대 네트워크 기술</strong>과 <strong>인공지능(AI) 융합 서비스</strong>를 연구합니다.<br /><br />
            데이터 통신부터 딥러닝 기반 데이터 분석, 그리고 이를 시각화하는 게임/메타버스까지.<br />
            우리는 기술의 경계를 넘어 새로운 가치를 창출하는 <strong>Full-Stack 연구자</strong>를 양성합니다.
          </p>
        </div>

        {/* 2. 주요 연구 분야 (Research Fields) - 카드 형태 */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">연구 분야</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchFields.map((field) => (
              <div key={field.id} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                <div className="text-5xl mb-6 bg-white w-20 h-20 flex items-center justify-center rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {field.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{field.title}</h4>
                <p className="text-gray-600 mb-6 leading-relaxed min-h-[3rem]">{field.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {field.keywords.map((k, i) => (
                    <span key={i} className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 모집 안내 및 혜택 (Recruit Info) */}
        {/* Home에서 버튼 클릭 시 이곳으로 스크롤됨 */}
        <div id="recruit-info" className="bg-gradient-to-br from-blue-900 to-slate-800 rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 왼쪽: 모집 문구 */}
            <div>
              <div className="inline-block bg-blue-500 text-xs font-bold px-3 py-1 rounded-full mb-4">RECRUITING</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                미래를 함께할<br />
                <span className="text-blue-300">석/박사 과정 및 학부 연구생</span>을<br />
                모집합니다.
              </h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                단순히 공부만 하는 곳이 아닙니다.<br />
                실제 프로젝트를 수행하며 <strong>실무 역량</strong>을 키우고,<br />
                국내외 학회 활동을 통해 <strong>넓은 세상</strong>을 경험하세요.
              </p>

              {/* 지원 자격 및 문의 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h5 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  지원 자격
                </h5>
                <p className="text-sm text-gray-300 mb-4">
                  - 컴퓨터공학 및 관련 전공 학부 3, 4학년 (학부연구생)<br />
                  - 대학원 진학 희망자 (석사/박사/석박통합)
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* [수정 1] 이메일 바로 복사 기능 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // constants.js에 정의된 contactEmail 사용 (혹은 email)
                      const email = labInfo.contactEmail || labInfo.email;
                      navigator.clipboard.writeText(email);
                      alert(`이메일 주소(${email})가 복사되었습니다.\n편하신 메일함에서 작성해 주세요! ✉️`);
                    }}
                    className="flex-1 bg-white text-blue-900 font-bold py-3 px-6 rounded-lg text-center hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    이메일 주소 복사하기
                  </button>

                  {/* [수정 2] 강제 스크롤 이동 기능 (URL #contact 무시) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        // URL을 변경하지 않고 부드럽게 스크롤만 수행
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        // 만약 메인 페이지가 아닐 경우를 대비한 방어 코드
                        window.location.href = '/#contact';
                      }
                    }}
                    className="flex-1 border border-white/50 text-white font-medium py-3 px-6 rounded-lg text-center hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    연구실 위치 보기
                  </button>
                </div>
              </div>
            </div>

            {/* 오른쪽: 혜택 리스트 */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h4 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">연구실 혜택 (Benefits)</h4>
              <ul className="space-y-6">
                {labBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 mt-1">
                      {/* 체크 아이콘 */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg text-white mb-1">{benefit.title}</h5>
                      <p className="text-sm text-gray-400">{benefit.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;