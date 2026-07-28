import { XMLParser } from 'fast-xml-parser';

export const handler = async (event) => {
  try {
    const mst = event.queryStringParameters.id;
    if (!mst) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing law ID (MST)' }) };
    }

    const API_KEY = 'aA3312418';
    const url = `https://www.law.go.kr/DRF/lawService.do?target=law&OC=${API_KEY}&type=XML&MST=${mst}`;
    
    const response = await fetch(url);
    const xml = await response.text();
    
    const parser = new XMLParser();
    const result = parser.parse(xml);
    
    let articles = [];
    if (result && result.법령 && result.법령.조문 && result.법령.조문.조문단위) {
      const allArticles = Array.isArray(result.법령.조문.조문단위) 
        ? result.법령.조문.조문단위 
        : [result.법령.조문.조문단위];
        
      // Filter out non-article elements (like chapter headers) and get the first 3 actual articles
      articles = allArticles
        .filter(a => a.조문여부 === '조문' && a.조문내용)
        .slice(0, 3)
        .map(a => a.조문내용.trim());
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles })
    };
  } catch (error) {
    console.error('Error fetching law details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch law details' })
    };
  }
};
