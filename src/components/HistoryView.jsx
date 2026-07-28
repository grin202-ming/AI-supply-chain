import React from 'react';
import { Mail, Eye } from 'lucide-react';

const HistoryView = () => {
  const history = [
    {
      id: 1,
      sentAt: '2026-07-27 10:00:00',
      subject: '[컴플라이언스 알림] 대외무역법 제 11조 개정 등 2건',
      recipientsCount: 45,
      openRate: '92%',
      status: '성공'
    },
    {
      id: 2,
      sentAt: '2026-07-25 09:30:00',
      subject: '[컴플라이언스 알림] 대외무역관리규정 신설 안내',
      recipientsCount: 45,
      openRate: '88%',
      status: '성공'
    },
    {
      id: 3,
      sentAt: '2026-07-10 14:00:00',
      subject: '[컴플라이언스 알림] 대외무역법 시행령 개정 요약 리포트',
      recipientsCount: 44,
      openRate: '95%',
      status: '성공'
    }
  ];

  return (
    <div className="content-scroll">
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>이메일 발송 이력 (Supabase DB)</h2>
          <div className="stat-desc">총 3건 발송됨</div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>발송 일시</th>
              <th>이메일 제목</th>
              <th>수신 대상</th>
              <th>열람률 (Open Rate)</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {history.map((log) => (
              <tr key={log.id}>
                <td>{log.sentAt}</td>
                <td style={{ fontWeight: 500, color: '#1E3A8A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} />
                    {log.subject}
                  </div>
                </td>
                <td>{log.recipientsCount}명</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={16} color="#64748B" />
                    <span style={{ fontWeight: 600 }}>{log.openRate}</span>
                  </div>
                </td>
                <td>
                  <span className="badge badge-success">{log.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryView;
