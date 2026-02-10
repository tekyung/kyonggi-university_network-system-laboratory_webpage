import React, { useMemo } from 'react';
import { SectionTitle } from '../../utils/constants';
// 논문 데이터 파일 (국제, 국내)
import int_pubData from '../../data/int_publicationsData';
import dm_pubData from '../../data/dm_publicationsData';

const Publications = () => {
  // [변경] 스마트 링크 생성 함수
  const getSearchUrl = (paper) => {
    const query = encodeURIComponent(paper.title);

    // 국내 논문 -> DBpia 검색
    if (paper.category === 'Domestic') {
      return `https://www.dbpia.co.kr/search/topSearch?searchOption=all&query=${query}`;
    }
    // 국제 논문 및 기타 -> 구글 스칼라 검색
    else {
      return `https://scholar.google.co.kr/scholar?hl=ko&q=${query}`;
    }
  };

  // 데이터를 병합하고 최신순 정렬 후 상위 5개 추출
  const recentPublications = useMemo(() => {
    // 1. 두 데이터 소스 병합 (ID 충돌 방지를 위해 uniqueId 생성)
    const formattedInt = int_pubData.publications.map(p => ({ ...p, uniqueId: `int-${p.id}`, category: 'International' }));
    const formattedDm = dm_pubData.publications.map(p => ({ ...p, uniqueId: `dm-${p.id}`, category: 'Domestic' }));

    const allPubs = [...formattedInt, ...formattedDm];

    // 2. 연도 기준 내림차순 정렬 (최신순)
    const sortedPubs = allPubs.sort((a, b) => Number(b.year) - Number(a.year));

    // 3. 상위 5개만 자르기
    return sortedPubs.slice(0, 5);
  }, []);

  // 추출된 5개 데이터를 연도별로 그룹화
  const groupedPublications = useMemo(() => {
    if (!recentPublications || recentPublications.length === 0) return [];

    const grouped = {};
    recentPublications.forEach(paper => {
      if (!grouped[paper.year]) {
        grouped[paper.year] = [];
      }
      grouped[paper.year].push(paper);
    });

    // 연도 내림차순 정렬하여 배열로 변환
    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map(year => ({
        year,
        papers: grouped[year]
      }));
  }, [recentPublications]);

  return (
    <section id="publications" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <SectionTitle>연구 실적</SectionTitle>
        <p className="text-center text-gray-500 mb-12 -mt-6">
          최근 수행한 주요 연구 결과물입니다. 카드를 클릭하면 논문 정보를 검색합니다.
        </p>

        <div className="max-w-4xl mx-auto">
          {groupedPublications.length > 0 ? (
            <div className="space-y-12">
              {groupedPublications.map(({ year, papers }) => (
                <div key={year} className="relative">
                  {/* 연도 표시 라인 */}
                  <div className="flex items-center mb-6">
                    <span className="text-2xl font-bold text-blue-900 bg-blue-50 px-4 py-1 rounded-lg border border-blue-100">
                      {year}
                    </span>
                    <div className="flex-grow h-px bg-gray-200 ml-4"></div>
                  </div>

                  <ul className="space-y-4">
                    {papers.map((paper) => (
                      <li
                        key={paper.uniqueId}
                        // [변경] 클릭 시 새 창으로 검색 링크 열기
                        onClick={() => window.open(getSearchUrl(paper), '_blank')}
                        className="group cursor-pointer rounded-xl border border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          {/* 상단 뱃지 영역 */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-2">
                              <span className={`text-xs font-bold px-2 py-1 rounded border ${paper.category === 'International'
                                  ? 'bg-purple-50 text-purple-600 border-purple-100'
                                  : 'bg-green-50 text-green-600 border-green-100'
                                }`}>
                                {paper.type}
                              </span>
                              <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded">
                                {paper.venue}
                              </span>
                            </div>

                            {/* [변경] 펼침 아이콘 -> 외부 링크 아이콘 (화살표) */}
                            <div className="text-gray-300 group-hover:text-blue-600 transition-colors duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>

                          {/* 논문 제목 및 저자 */}
                          <h4 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-blue-700 transition-colors">
                            {paper.title}
                          </h4>
                          <p className="text-gray-600 text-sm">{paper.authors}</p>
                        </div>

                        {/* [삭제] 요약(Abstract) 아코디언 영역 제거됨 */}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">게재된 논문 정보를 불러오는 중입니다...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Publications;