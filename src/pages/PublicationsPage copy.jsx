import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import int_pubData from '../data/int_publicationsData';
import dm_pubData from '../data/dm_publicationsData';
import book_pubData from '../data/book_publicationsData';

const PublicationsPage = () => {
    const navigate = useNavigate();
    const { hash } = useLocation();

    // 필터 상태: 'All', 'International', 'Domestic', 'Books'
    const [filter, setFilter] = useState('All');

    // 여러 논문의 요약을 동시에 보기 위한 상태 (ID 배열로 관리)
    const [expandedIds, setExpandedIds] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 스마트 링크 생성 함수
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

    const toggleAbstract = (id) => {
        setExpandedIds((prevIds) => {
            if (prevIds.includes(id)) {
                return prevIds.filter((prevId) => prevId !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    // 데이터 병합 및 정렬
    const allPublications = useMemo(() => {
        const formattedInt = int_pubData.publications.map(p => ({
            ...p,
            uniqueId: `int-${p.id}`,
            category: 'International',
            categoryLabel: '국제 학술대회'
        }));
        const formattedDm = dm_pubData.publications.map(p => ({
            ...p,
            uniqueId: `dm-${p.id}`,
            category: 'Domestic',
            categoryLabel: '국내 저널/학회'
        }));
        const formattedBooks = (book_pubData.publications || []).map(p => ({
            ...p,
            uniqueId: `book-${p.id}`,
            category: 'Books',
            categoryLabel: '저서',
            type: 'Book',
            venue: p.publisher || p.venue // 저서는 출판사(publisher)로 수정 가능성 여지 남김
        }));

        // 최신순 정렬
        return [...formattedInt, ...formattedDm, ...formattedBooks].sort((a, b) => Number(b.year) - Number(a.year));
    }, []);

    // 필터링된 데이터
    const filteredPublications = useMemo(() => {
        if (filter === 'All') return allPublications;
        return allPublications.filter(p => p.category === filter);
    }, [filter, allPublications]);

    // 연도별 그룹화
    const groupedPublications = useMemo(() => {
        const grouped = {};
        filteredPublications.forEach(paper => {
            if (!grouped[paper.year]) grouped[paper.year] = [];
            grouped[paper.year].push(paper);
        });

        return Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a))
            .map(year => ({
                year,
                papers: grouped[year]
            }));
    }, [filteredPublications]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* 상단 헤더 영역 */}
            <main className="flex-grow container mx-auto px-6 py-12 max-w-5xl">
                <div className="text-center mb-12">
                    <Link to="/" className="text-blue-600 font-medium mb-10 mt-20 inline-block">← 메인으로 돌아가기</Link>
                    <h2 className="text-5xl font-black text-gray-900 mb-6">논문 및 저서</h2>
                    <h2 className="text-4xl md:text-1 font-italic text-blue-600 mb-10">Publications</h2>
                    {/* 필터 버튼 그룹 */}
                    <div className="inline-flex flex-wrap justify-center bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                        {[
                            { key: 'All', label: '전체 보기' },
                            { key: 'International', label: '국제 학술대회' },
                            { key: 'Domestic', label: '국내 저널/학회' },
                            { key: 'Books', label: '저서' }
                        ].map((btn) => (
                            <button
                                key={btn.key}
                                onClick={() => setFilter(btn.key)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${filter === btn.key
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 논문 리스트 영역 */}
                <div className="space-y-16">
                    {groupedPublications.map(({ year, papers }) => (
                        <div key={year} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl font-bold text-gray-900/50 select-none mr-4">{year}</span>
                                <div className="h-px bg-gray-200 flex-grow"></div>
                            </div>

                            <ul className="space-y-4">
                                {papers.map((paper) => (
                                    <li
                                        key={paper.uniqueId}
                                        // 클릭 시 새 창으로 검색 링크 열기
                                        onClick={() => window.open(getSearchUrl(paper), '_blank')}
                                        className="group cursor-pointer rounded-xl border border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            {/* 상단 뱃지 영역 */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex gap-2">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded border ${paper.category === 'International'
                                                        ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                        : paper.category === 'Domestic' ? 'bg-green-50 text-green-600 border-green-100'
                                                            : 'bg-orange-50 text-orange-600 border-orange-100'
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
                            {/* 기존 논문 요약 정보 봉인}
                            <ul className="grid gap-4">
                                {papers.map((paper) => {
                                    const isExpanded = expandedIds.includes(paper.uniqueId);

                                    return (
                                        <li
                                            key={paper.uniqueId}
                                            onClick={() => toggleAbstract(paper.uniqueId)}
                                            className={`
                        group relative bg-white rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
                        ${isExpanded
                                                    ? 'border-blue-400 shadow-md ring-1 ring-blue-100'
                                                    : 'border-gray-300 hover:border-blue-400 hover:shadow-lg'
                                                }
                      `}
                                        >
                                            {/* 카드 내용 }
                                            <div className="p-6 sm:p-8">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        {/* 카테고리 뱃지 }
                                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase ${paper.category === 'International'
                                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                            : paper.category === 'Domestic'
                                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                                : 'bg-orange-50 text-orange-700 border-orange-100' // 저서 색상(Orange)
                                                            }`}>
                                                            {paper.type}
                                                        </span>
                                                        <span className="text-gray-400 text-xs font-medium px-2 py-0.5 border border-gray-100 rounded bg-gray-50">
                                                            {paper.venue}
                                                        </span>
                                                    </div>
                                                    {/* 펼침/접힘 화살표 아이콘 봉인 }
                                                    <div className={`hidden sm:block text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-400'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                    { 펼침/접힘 화살표 아이콘 봉인 }
                                                </div>

                                                <h3 className={`text-lg sm:text-xl font-bold mb-3 leading-snug transition-colors ${isExpanded ? 'text-blue-800' : 'text-gray-800 group-hover:text-blue-700'
                                                    }`}>
                                                    {paper.title}
                                                </h3>

                                                <p className="text-gray-600 text-sm">{paper.authors}</p>
                                            </div>

                                            {/* 요약(Abstract) 영역 봉인 }
                                            <div
                                                className={`
                          transition-[max-height, opacity] duration-500 ease-in-out bg-blue-50/30
                          ${isExpanded ? 'max-h-[500px] opacity-100 border-t border-blue-100' : 'max-h-0 opacity-0'}
                        `}
                                                >
                                                <div className="p-6 sm:p-8 pt-4">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl mt-0.5">📝</span>
                                                        <div>
                                                            <h4 className="font-bold text-blue-900 text-sm mb-2 uppercase tracking-wider">Abstract</h4>
                                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                                                {paper.abstract ? paper.abstract : (
                                                                    <span className="text-gray-400 italic">
                                                                        {paper.category === 'Books'
                                                                            ? '책 소개 내용이 등록되지 않았습니다.'
                                                                            : '해당 논문의 요약 정보가 아직 등록되지 않았습니다.'
                                                                        }
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            { 요약(Abstract) 영역 봉인 }
                                        </li>
                                    );
                                })}
                            </ul>
                            {*/}
                        </div>
                    ))}

                    {groupedPublications.length === 0 && (
                        <div className="text-center py-32">
                            <p className="text-gray-500 text-lg">해당하는 연구 실적 데이터가 없습니다.</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 py-8 mt-12">
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Network & System Lab. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

export default PublicationsPage;