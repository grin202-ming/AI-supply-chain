import { XMLParser } from 'fast-xml-parser';

export const handler = async (event, context) => {
  try {
    const query = encodeURIComponent('대외무역법');
    const API_KEY = 'aA3312418';
    const url = `https://www.law.go.kr/DRF/lawSearch.do?target=law&OC=${API_KEY}&type=XML&query=${query}`;
    
    const response = await fetch(url);
    const xml = await response.text();
    
    const parser = new XMLParser();
    const result = parser.parse(xml);
    
    const laws = result.LawSearch.law;
    
    // Map to our UI data structure
    const mappedLaws = Array.isArray(laws) ? laws.map((law, idx) => ({
      id: law.법령일련번호 || idx,
      lawName: law.법령명한글,
      article: '상세보기 참조', // The search API doesn't give specific articles, so we generalize
      promulgationDate: String(law.공포일자).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
      effectiveDate: String(law.시행일자).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
      type: law.제개정구분명,
      status: law.제개정구분명 === '신설' || law.제개정구분명 === '제정' ? 'new' : 'update'
    })) : [];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mappedLaws)
    };
  } catch (error) {
    console.error('Error fetching laws:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch law data' })
    };
  }
};
