import { XMLParser } from 'fast-xml-parser';

export const handler = async (event) => {
  try {
    const mst = event.queryStringParameters.id;
    if (!mst) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing law ID (MST)' }) };
    }

    const LAW_API_KEY = 'aA3312418';
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // 1. Fetch Law Articles
    const url = `https://www.law.go.kr/DRF/lawService.do?target=law&OC=${LAW_API_KEY}&type=XML&MST=${mst}`;
    const response = await fetch(url);
    const xml = await response.text();
    
    const parser = new XMLParser();
    const result = parser.parse(xml);
    
    let articles = [];
    if (result && result.법령 && result.법령.조문 && result.법령.조문.조문단위) {
      const allArticles = Array.isArray(result.법령.조문.조문단위) 
        ? result.법령.조문.조문단위 
        : [result.법령.조문.조문단위];
        
      articles = allArticles
        .filter(a => a.조문여부 === '조문' && a.조문내용)
        .slice(0, 5)
        .map(a => a.조문내용.trim());
    }

    // 2. Fetch AI Analysis if articles exist
    let aiAnalysis = null;
    if (articles.length > 0) {
      const promptText = `
다음 법령 조문들을 읽고 무역 컴플라이언스 관점에서 3가지를 분석해줘. JSON 형식으로만 응답해.
법령 내용:
${articles.join('\n')}

요구사항:
1. summary: 주요 변경 요약 (1~2문장)
2. intent: 개정 취지 (1~2문장)
3. risk: 실무 리스크 영향 (상세한 리스크 설명)
4. riskLevel: HIGH RISK, MEDIUM RISK, LOW RISK 중 하나 선택

반드시 아래 JSON 형식으로만 반환해:
{
  "summary": "...",
  "intent": "...",
  "risk": "...",
  "riskLevel": "..."
}
`;

      try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { response_mime_type: 'application/json' }
          })
        });
        const aiData = await aiRes.json();
        
        if (aiData.candidates && aiData.candidates.length > 0) {
          const aiJsonStr = aiData.candidates[0].content.parts[0].text;
          aiAnalysis = JSON.parse(aiJsonStr);
        } else {
          console.error('AI API Error:', aiData);
        }
      } catch (aiErr) {
        console.error('AI Analysis request failed:', aiErr);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles, aiAnalysis })
    };
  } catch (error) {
    console.error('Error fetching law details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch law details' })
    };
  }
};
