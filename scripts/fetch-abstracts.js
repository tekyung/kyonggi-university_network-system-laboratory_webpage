const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axios = require('axios');

// 파일 경로 설정
const INT_DATA_PATH = path.join(__dirname, '../src/data/int_publicationsData.js');
const DM_DATA_PATH = path.join(__dirname, '../src/data/dm_publicationsData.js');

// 딜레이 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 데이터 로드/저장 함수 (기존과 동일)
function loadData(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/publications:\s*(\[[\s\S]*?\])\s*}/);
    if (!match) return null;
    try {
        const extracted = new Function(`return ${match[1]}`)();
        return { content, publications: extracted };
    } catch (e) { return null; }
}

function saveData(filePath, originalContent, updatedPublications) {
    const jsonString = JSON.stringify(updatedPublications, null, 4);
    const newContent = originalContent.replace(/publications:\s*\[[\s\S]*?\]\s*}/, `publications: ${jsonString}\n}`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`💾 저장 완료: ${path.basename(filePath)}`);
}

// [해외 논문] Semantic Scholar API (기존 유지)
async function fetchAbstractFromSemanticScholar(title) {
    // ... (기존 코드와 동일, 생략 없이 필요하다면 이전 답변 참고)
    // 여기서는 지면상 핵심인 DBpia 함수만 업데이트합니다.
    try {
        const response = await axios.get('https://api.semanticscholar.org/graph/v1/paper/search', {
            params: { query: title, limit: 1, fields: 'title,abstract' }
        });
        if (response.data.total > 0 && response.data.data[0].abstract) {
            return response.data.data[0].abstract;
        }
    } catch (e) { return null; }
    return null;
}

// 2. [국내 논문] DBpia 정밀 크롤링 (업데이트됨)
async function fetchAbstractFromDBpia(browser, title) {
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 1280, height: 800 });

        // 1. 검색 페이지 접속
        const searchUrl = `https://www.dbpia.co.kr/search/topSearch?searchOption=all&query=${encodeURIComponent(title)}`;
        console.log(`🔎 [DBpia 검색] ${title}`);
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // 2. [수정] 검색 결과 링크 찾기 (AI 요약 회피)
        // #dev_search_list: 실제 논문 리스트가 담긴 ID (가장 정확함)
        // .thesis__link, .title: 논문 제목 링크 클래스
        let articleUrl = null;
        try {
            // 검색 리스트가 뜰 때까지 대기
            await page.waitForSelector('#dev_search_list a', { timeout: 10000 });

            // AI 요약 섹션(.aiSummary 등)이 아닌, 실제 리스트(#dev_search_list) 내부의 첫 번째 링크 추출
            articleUrl = await page.$eval('#dev_search_list li:first-child a[href^="/journal/articleDetail"]', el => el.href);

            console.log("   🔗 상세 페이지 링크 확보 완료");
        } catch (e) {
            console.log("   ❌ 검색 결과 리스트를 찾지 못함 (구조 변경 또는 결과 없음)");
            await page.close();
            return null;
        }

        // 3. 상세 페이지 이동
        await page.goto(articleUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // 4. [수정] 초록 텍스트 추출 (문맥 기반 탐색)
        let abstract = null;

        // 전략 A: "초록" 또는 "Abstract" 텍스트를 가진 헤더(h2, h3, strong)를 찾고 그 형제/부모 요소 탐색
        // (사용자가 말한 '초록 키워드' 섹션 타겟팅)
        try {
            abstract = await page.evaluate(() => {
                // 1. 모든 헤더급 요소 스캔
                const candidates = Array.from(document.querySelectorAll('h1, h2, h3, h4, strong, dt, .tit'));

                for (const el of candidates) {
                    const text = el.innerText.trim().replace(/\s/g, ''); // 공백 제거 후 비교
                    if (text === '초록' || text === 'Abstract' || text.includes('초록·키워드')) {
                        // 형제 요소 중 텍스트가 있는 div/p 찾기
                        let target = el.nextElementSibling;
                        while (target) {
                            if (target.innerText && target.innerText.length > 30) {
                                return target.innerText.trim();
                            }
                            target = target.nextElementSibling;
                        }
                        // 바로 옆에 없으면 부모의 다음 요소 등 탐색 (구조에 따라 다름)
                        if (el.parentElement) {
                            const parentNext = el.parentElement.querySelector('.abstract_txt, .con_txt');
                            if (parentNext) return parentNext.innerText.trim();
                        }
                    }
                }
                return null;
            });
        } catch (e) { }

        // 전략 B: 전통적인 클래스 탐색 (Fallback)
        if (!abstract) {
            const selectors = ['.abstract_txt', '#pub_abstract', '.article_abstract', '.abstract'];
            for (const selector of selectors) {
                try {
                    abstract = await page.$eval(selector, el => el.innerText.trim());
                    if (abstract) break;
                } catch (e) { }
            }
        }

        if (abstract && abstract.length > 20) {
            console.log(`   ✅ 초록 추출 성공! (${abstract.length}자)`);
            await page.close();
            return abstract;
        } else {
            console.log("   ❌ 상세 페이지 진입 성공했으나 초록 텍스트 발견 실패");
        }

    } catch (error) {
        console.error("   ⚠️ 크롤링 에러:", error.message);
    }

    await page.close();
    return null;
}

// === 실행부 (DBpia만 테스트) ===
(async () => {
    console.log("🚀 DBpia 전용 크롤러 시작 (Headless: False)...");

    const dmData = loadData(DM_DATA_PATH);
    if (dmData) {
        // 테스트를 위해 초록이 없는 것 중 1개만 먼저 시도하거나 전체 시도
        // 여기서는 전체 시도
        const targetPubs = dmData.publications.filter(p => !p.abstract);

        if (targetPubs.length > 0) {
            const browser = await puppeteer.launch({
                headless: false, // 브라우저 창 띄움 (디버깅용)
                args: ['--window-size=1280,1000']
            });

            let updated = false;
            for (const pub of targetPubs) {
                const abstract = await fetchAbstractFromDBpia(browser, pub.title);
                if (abstract) {
                    pub.abstract = abstract;
                    updated = true;
                }
                // 3초 대기
                await delay(3000);
            }

            await browser.close();

            if (updated) saveData(DM_DATA_PATH, dmData.content, dmData.publications);

        } else {
            console.log("\n✨ 모든 국내 논문에 이미 요약이 있습니다.");
        }
    }
    console.log("\n🎉 종료");
})();