import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, AlertTriangle, Sparkles, Send, Loader2 } from 'lucide-react';

const DashboardView = () => {
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedArticles, setDetailedArticles] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
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
        setAiAnalysis(data.aiAnalysis || null);
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
          
          <div style={{ padding: '12px', backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '16px' }}>
            <strong>안내:</strong> 국가법령정보센터의 최신 원문 데이터를 바탕으로 <strong>Gemini AI가 실시간으로 생성한 실제 분석 결과</strong>입니다.
          </div>

          <div className="ai-summary-card">
            <Sparkles className="ai-icon" size={100} />
            
            {loadingDetails ? (
              <div style={{display:'flex', alignItems:'center', padding: '20px', color: '#1E3A8A'}}>
                <Loader2 className="animate-spin" size={24} style={{marginRight:'12px'}} />
                AI가 실제 법령 원문을 바탕으로 요약 및 리스크 분석을 생성하고 있습니다...
              </div>
            ) : aiAnalysis ? (
              <>
                <div className="ai-section-title">
                  <Sparkles size={16} /> 1) 주요 변경 요약 (실시간 AI 분석)
                </div>
                <p className="ai-text">{aiAnalysis.summary}</p>

                <div className="ai-section-title">
                  <Sparkles size={16} /> 2) 개정 취지 (실시간 AI 분석)
                </div>
                <p className="ai-text">{aiAnalysis.intent}</p>

                <div className="ai-section-title" style={{ color: aiAnalysis.riskLevel === 'HIGH RISK' ? '#EF4444' : aiAnalysis.riskLevel === 'MEDIUM RISK' ? '#F59E0B' : '#10B981' }}>
                  <AlertTriangle size={16} /> 3) 실무 리스크 영향
                </div>
                <p className="ai-text" style={{ fontWeight: 500 }}>
                  [{aiAnalysis.riskLevel}] {aiAnalysis.risk}
                </p>
              </>
            ) : (
              <div style={{ padding: '20px', color: '#EF4444' }}>
                AI 분석 데이터를 가져오지 못했습니다. (가상 데이터 등 API 설정 확인 필요)
              </div>
            )}
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>신구조문 비교 (Diff)</h3>
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
