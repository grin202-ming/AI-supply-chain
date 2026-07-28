import React, { useState } from 'react';
import { BookOpen, FileText, AlertTriangle, Sparkles, Send } from 'lucide-react';

const DashboardView = () => {
  const [selectedRevision, setSelectedRevision] = useState(null);

  // Mock Data based on PRD REQ-02
  const revisions = [
    {
      id: 1,
      lawName: '대외무역법',
      article: '제 11조',
      promulgationDate: '2026-07-27',
      effectiveDate: '2026-08-01',
      type: '일부개정',
      status: 'new'
    },
    {
      id: 2,
      lawName: '대외무역관리규정',
      article: '제 4조 2항',
      promulgationDate: '2026-07-25',
      effectiveDate: '2026-07-25',
      type: '신설',
      status: 'update'
    },
    {
      id: 3,
      lawName: '대외무역법 시행령',
      article: '제 8조',
      promulgationDate: '2026-07-10',
      effectiveDate: '2026-07-15',
      type: '타법개정',
      status: 'update'
    }
  ];

  return (
    <div className="content-scroll">
      <div className="overview-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">모니터링 대상 법령</span>
            <BookOpen size={20} color="#1E3A8A" />
          </div>
          <span className="stat-value">3<span style={{fontSize: '1rem', fontWeight: 500, color: '#64748B'}}> 개</span></span>
          <span className="stat-desc">대외무역법, 시행령, 관리규정</span>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">최근 7일 개정 건수</span>
            <FileText size={20} color="#F59E0B" />
          </div>
          <span className="stat-value">2<span style={{fontSize: '1rem', fontWeight: 500, color: '#64748B'}}> 건</span></span>
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
        <h2 className="section-title">최근 제·개정 법령 내역</h2>
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
      </div>

      {selectedRevision && (
        <div className="section-card" style={{ border: '1px solid #1E3A8A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>
              AI 리스크 분석 리포트: {selectedRevision.lawName} {selectedRevision.article}
            </h2>
            <button className="btn btn-outline" onClick={() => setSelectedRevision(null)}>닫기</button>
          </div>
          
          <div className="ai-summary-card">
            <Sparkles className="ai-icon" size={100} />
            <div className="ai-section-title">
              <Sparkles size={16} /> 1) 주요 변경 요약
            </div>
            <p className="ai-text">
              수출입 승인 면제 대상 품목이 기존 15개에서 20개로 확대되었습니다. 특정 첨단기술 품목에 대한 사전 신고 의무화 조항이 추가되었습니다.
            </p>

            <div className="ai-section-title">
              <Sparkles size={16} /> 2) 개정 취지
            </div>
            <p className="ai-text">
              글로벌 공급망 불확실성에 대응하고 국내 첨단 산업 보호를 강화하기 위해 전략물자 수출입 관리 체계를 개편하기 위함입니다.
            </p>

            <div className="ai-section-title" style={{ color: '#EF4444' }}>
              <AlertTriangle size={16} color="#EF4444" /> 3) 실무 리스크 영향
            </div>
            <p className="ai-text" style={{ fontWeight: 500 }}>
              [HIGH RISK] 기존에 면제받던 일부 첨단 부품 수입 시 사전 신고 누락 시 통관 지연 및 과태료 부과 위험이 존재합니다. 관련 물류 부서에 즉각적인 프로세스 변경 공지가 필요합니다.
            </p>
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
              <div className="diff-header">개정안 (변경 후)</div>
              <div className="diff-content">
                제 11조 (수출입의 승인 등)<br/>
                ① 수출입 공고에 따른 제한품목을 수출하거나 수입하려는 자는 산업통상자원부장관의 승인을 받아야 한다.<br/><br/>
                <span className="diff-added">② 제1항에도 불구하고 다음 각 호의 어느 하나에 해당하는 경우에는 승인을 받지 아니하고 수출하거나 수입할 수 있다. <strong>다만, 대통령령으로 정하는 첨단기술 품목은 사전 신고를 하여야 한다.</strong></span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default DashboardView;
