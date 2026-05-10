import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (username: string, email: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onRegister(username, email, password);
      }
    } catch (error) {
      console.error('登录/注册错误:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          🏃 悦动
        </h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="输入用户名"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱"
              required
            />
          </div>

          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              required
            />
          </div>

          <button
            type="submit"
            className="button button-primary"
            style={{ width: '100%', marginBottom: '15px' }}
            disabled={loading}
          >
            {loading ? '处理中...' : isLogin ? '登录' : '注册'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            {isLogin ? '还没有账户？' : '已有账户？'}
          </p>
          <button
            className="button button-secondary"
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername('');
              setEmail('');
              setPassword('');
            }}
            style={{ width: '100%' }}
          >
            {isLogin ? '去注册' : '去登录'}
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f0f9ff',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          <p>💡 演示账户：</p>
          <p>邮箱: demo@example.com</p>
          <p>密码: demo123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
