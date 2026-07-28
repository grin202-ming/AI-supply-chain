import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, AlertTriangle, Sparkles, Send, Loader2 } from 'lucide-react';

const DashboardView = () => {
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedArticles, setDetailedArticles] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        setLoading(true);
        // We call our Netlify function instead of calling the external API directly
        const response = await fetch('/api/getLaws');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setRevisions(data);
      } catch (err) {
        console.error(err);
        setError('법령 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedRevision) return;
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/getLawDetail?id=${selectedRevision.id}`);
        const data = await res.json();
        setDetailedArticles(data.articles || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [selectedRevision]);

  return (
    <div className="content-scroll">
      <div className="overview-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">모니터링 대상 법령</span>
            <BookOpen size={20} color="#1E3A8A" />
          </div>
          <span className="stat-value">
            {loading ? '-' : revisions.length}
            <span style={{fontSize: '1rem', fontWeight: 500, color: '#64748B'}}> 건</span>
          </span>
          <span className="stat-desc">검색된 법령 수</span>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">최근 1년 개정 건수</span>
            <FileText size={20} color="#F59E0B" />
          </div>
          <span className="stat-value">
            {loading ? '-' : revisions.filter(r => r.type === '일부개정' || r.type === '타법개정' || r.type === '전부개정').length}
            <span style={{fontSize: '1rem', fontWeight: 500, color: '#64748B'}}> 건</span>
          </span>
          <span className="stat-desc" style={{color: '#F59E0B'}}>업데이트 감지됨</span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">금일 발송된 리포트</span>
            <Send size={20} color="#10B981" />
          </div>
          <span className="stat-value">100<span style={{fontSize: '1rem', fontWeight: 500, color: '#64748B'}}> %</span></span>
          <span className="stat-desc" style={{color: '#10B981'}}>전원 발송 완료</span>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">최근 제·개정 법령 내역 (실제 실시간 데이터)</h2>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0', color: '#64748B' }}>
            <Loader2 className="animate-spin" size={24} style={{ marginRight: '8px' }} />
            국가법령정보센터에서 데이터를 불러오는 중입니다...
          </div>
        ) : error ? (
          <div style={{ padding: '20px', color: '#EF4444', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>
            {error}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>상태</th>
                <th>법령명</th>
                <th>조항 번호</th>
                <th>개정 유형</th>
                <th>공포일</th>
                <th>시행일</th>
                <th>상세 분석</th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((rev) => (
                <tr key={rev.id}>
                  <td>
                    <span className={`badge ${rev.status === 'new' ? 'badge-new' : 'badge-update'}`}>
                      {rev.status === 'new' ? 'NEW' : 'UPDATE'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{rev.lawName}</td>
                  <td>{rev.article}</td>
                  <td>{rev.type}</td>
                  <td>{rev.promulgationDate}</td>
                  <td>{rev.effectiveDate}</td>
                  <td>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                      onClick={() => setSelectedRevision(rev)}
                    >
                      분석 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedRevision && (
        <div className="section-card" style={{ border: '1px solid #1E3A8A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>
              AI 리스크 분석 리포트: {selectedRevision.lawName}
            </h2>
            <button className="btn btn-outline" onClick={() => setSelectedRevision(null)}>닫기</button>
          </div>
          
          <div style={{ padding: '12px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '16px' }}>
            <strong>안내:</strong> 법령 목록과 '개정안' 원문 텍스트는 국가법령정보센터의 실제 데이터를 실시간으로 가져옵니다. 단, AI 요약 및 현행(이전) 조문 데이터는 시각적 예시를 위한 가상 데이터입니다.
          </div>

          <div className="ai-summary-card">
            <Sparkles className="ai-icon" size={100} />
            <div className="ai-section-title">
              <Sparkles size={16} /> 1) 주요 변경 요약 (가상 데이터)
            </div>
            <p className="ai-text">
              수출입 승인 면제 대상 품목이 기존 15개에서 20개로 확대되었습니다. 특정 첨단기술 품목에 대한 사전 신고 의무화 조항이 추가되었습니다.
            </p>

            <div className="ai-section-title">
              <Sparkles size={16} /> 2) 개정 취지 (가상 데이터)
            </div>
            <p className="ai-text">
              글로벌 공급망 불확실성에 대응하고 국내 첨단 산업 보호를 강화하기 위해 전략물자 수출입 관리 체계를 개편하기 위함입니다.
            </p>

            <div className="ai-section-title" style={{ color: '#EF4444' }}>
              <AlertTriangle size={16} color="#EF4444" /> 3) 실무 리스크 영향 (가상 데이터)
            </div>
            <p className="ai-text" style={{ fontWeight: 500 }}>
              [HIGH RISK] 기존에 면제받던 일부 첨단 부품 수입 시 사전 신고 누락 시 통관 지연 및 과태료 부과 위험이 존재합니다. 관련 물류 부서에 즉각적인 프로세스 변경 공지가 필요합니다.
            </p>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>신구조문 비교 (Diff) - 가상 데이터</h3>
          <div className="diff-container">
            <div className="diff-panel">
              <div className="diff-header">현행 (변경 전)</div>
              <div className="diff-content">
                제 11조 (수출입의 승인 등)<br/>
                ① 수출입 공고에 따른 제한품목을 수출하거나 수입하려는 자는 산업통상자원부장관의 승인을 받아야 한다.<br/><br/>
                <span className="diff-deleted">② 제1항에도 불구하고 다음 각 호의 어느 하나에 해당하는 경우에는 승인을 받지 아니하고 수출하거나 수입할 수 있다.</span>
              </div>
            </div>
            <div className="diff-panel">
              <div className="diff-header">개정안 (변경 후) - 실제 원문 데이터</div>
              <div className="diff-content">
                {loadingDetails ? (
                  <div style={{display:'flex', alignItems:'center', color:'#64748B'}}>
                    <Loader2 className="animate-spin" size={16} style={{marginRight:'8px'}}/>
                    실제 조문 원문을 불러오는 중...
                  </div>
                ) : detailedArticles.length > 0 ? (
                  detailedArticles.map((text, idx) => (
                    <div key={idx} style={{marginBottom:'12px'}}>{text}</div>
                  ))
                ) : (
                  '상세 조문 정보를 가져올 수 없습니다.'
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default DashboardView;
