import React from 'react';
import { UserPlus, Clock, Trash2, CheckCircle } from 'lucide-react';

const SettingsView = () => {
  const recipients = [
    { id: 1, email: 'compliance@company.com', role: '컴플라이언스 팀 (그룹)' },
    { id: 2, email: 'legal_admin@company.com', role: '법무 관리자' },
    { id: 3, email: 'logistics_head@company.com', role: '물류/수출입 본부장' }
  ];

  return (
    <div className="content-scroll">
      
      <div className="section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <Clock size={20} color="#1E3A8A" />
          <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>모니터링 감지 주기 설정</h2>
        </div>
        
        <div className="form-group">
          <label className="form-label">국가법령정보센터 크롤링 주기</label>
          <select className="form-select" defaultValue="weekly">
            <option value="hourly">매시간 (Hourly)</option>
            <option value="daily">매일 오전 9시 (Daily)</option>
            <option value="weekly">매주 월요일 (Weekly - Recommended)</option>
          </select>
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '8px' }}>
            * 너무 짧은 주기로 설정 시 국가법령정보센터 IP 차단 위험이 있으므로 1일 1회를 권장합니다.
          </p>
        </div>
        
        <button className="btn btn-primary" onClick={() => alert('설정이 저장되었습니다.')}>
          <CheckCircle size={16} /> 저장
        </button>
      </div>

      <div className="section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <UserPlus size={20} color="#1E3A8A" />
          <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>알림 수신자 관리</h2>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input type="email" className="form-input" placeholder="수신자 이메일 주소 입력" />
          <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>추가하기</button>
        </div>

        <div className="recipient-list">
          {recipients.map(user => (
            <div className="recipient-item" key={user.id}>
              <div className="recipient-info">
                <span className="recipient-email">{user.email}</span>
                <span className="recipient-role">{user.role}</span>
              </div>
              <button className="btn btn-outline" style={{ padding: '6px', color: '#EF4444', borderColor: '#FEE2E2' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SettingsView;
