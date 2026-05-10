import React, { useState, useEffect } from 'react';
import { petAPI } from '../api';
import { Pet } from '../store';
import { PetDrawer } from '../components/PetDrawer';
import EvolutionProgress from '../components/EvolutionProgress';

interface PetDetailPageProps {
  petId: string;
  onBack: () => void;
}

const PetDetailPage: React.FC<PetDetailPageProps> = ({ petId, onBack }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false);
  const [petInteraction, setPetInteraction] = useState<string>('');
  const [feedCount, setFeedCount] = useState(0);

  useEffect(() => {
    loadPetDetail();
  }, [petId]);

  const loadPetDetail = async () => {
    try {
      setLoading(true);
      const res = await petAPI.getDetail(petId);
      setPet(res.data);
    } catch (error) {
      console.error('加载宠物详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEvolution = async () => {
    if (!pet) return;
    try {
      const res = await petAPI.checkEvolution(petId);
      if (res.data.evolved) {
        setShowEvolutionAnimation(true);
        setPetInteraction('🎉 进化成功！');
        setTimeout(() => {
          setShowEvolutionAnimation(false);
          setPetInteraction('');
          loadPetDetail();
        }, 2000);
      } else {
        setPetInteraction('还需要更多运动量呢~');
        setTimeout(() => setPetInteraction(''), 2000);
      }
    } catch (error) {
      console.error('检查进化失败:', error);
    }
  };

  const handlePetClick = () => {
    const interactions = ['😊', '🥰', '😄', '🤗', '💕'];
    setPetInteraction(interactions[Math.floor(Math.random() * interactions.length)]);
    setTimeout(() => setPetInteraction(''), 1500);
  };

  const handleFeed = () => {
    setFeedCount(prev => prev + 1);
    setPetInteraction('🍖 嗯嗯，好吃！');
    setTimeout(() => setPetInteraction(''), 1500);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!pet) {
    return <div className="error">宠物不存在</div>;
  }

  const personalityMap: any = {
    active: '活泼',
    gentle: '温柔',
    naughty: '调皮',
    lazy: '懒散'
  };

  const genderMap: any = {
    male: '男',
    female: '女',
    unknown: '不确定'
  };

  const formMap: any = {
    lazy_bug: '懒懒虫',
    rabbit: '小兔子',
    deer: '小鹿',
    shiny_rabbit: '闪闪兔'
  };

  const formEmoji: any = {
    lazy_bug: '🐛',
    rabbit: '🐰',
    deer: '🦌',
    shiny_rabbit: '✨🐰'
  };

  return (
    <div className="container">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← 返回</button>
        <h1>{pet.name}</h1>
      </div>

      {/* 宠物大图 - 可交互 */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ width: '200px', height: '200px', margin: '0 auto', cursor: 'pointer' }} onClick={handlePetClick}>
            <PetDrawer form={pet.current_form} trustLevel={pet.trust_level} />
          </div>
          {petInteraction && (
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '32px',
                animation: 'float-up 1.5s ease-out forwards'
              }}
            >
              {petInteraction}
            </div>
          )}
          {showEvolutionAnimation && (
            <div className="evolution-animation">
              <div className="evolution-text">进化成功！</div>
            </div>
          )}
        </div>
        <div style={{ marginTop: '20px', fontSize: '48px' }}>
          {formEmoji[pet.current_form]}
        </div>
      </div>

      {/* 快速操作按钮 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>互动</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            className="button button-primary"
            onClick={handleFeed}
            style={{ width: '100%' }}
          >
            🍖 喂食 ({feedCount})
          </button>
          <button
            className="button button-secondary"
            onClick={handlePetClick}
            style={{ width: '100%' }}
          >
            🎮 逗宠物
          </button>
        </div>
      </div>

      {/* 属性卡片 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>基本信息</h3>
        <div className="pet-attributes">
          <div className="attribute">
            <span className="label">名字</span>
            <span className="value">{pet.name}</span>
          </div>
          <div className="attribute">
            <span className="label">性格</span>
            <span className="value">{personalityMap[pet.personality]}</span>
          </div>
          <div className="attribute">
            <span className="label">性别</span>
            <span className="value">{genderMap[pet.gender]}</span>
          </div>
          <div className="attribute">
            <span className="label">当前形态</span>
            <span className="value">{formMap[pet.current_form]}</span>
          </div>
          <div className="attribute">
            <span className="label">信任度</span>
            <span className="value">{pet.trust_level}/100</span>
          </div>
          <div className="attribute">
            <span className="label">总运动量</span>
            <span className="value">{pet.total_kcal} kcal</span>
          </div>
        </div>
      </div>

      {/* 信任度进度条 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>信任度</h3>
        <div className="progress-bar" style={{ marginBottom: '10px' }}>
          <div
            className="progress-fill"
            style={{
              width: `${pet.trust_level}%`,
              background: pet.trust_level > 70 ? '#51cf66' : pet.trust_level > 40 ? '#ff922b' : '#ff6b6b',
              transition: 'width 0.3s ease'
            }}
          >
            {pet.trust_level}%
          </div>
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {pet.trust_level > 80 && '🥰 宠物非常信任你！'}
          {pet.trust_level > 60 && pet.trust_level <= 80 && '😊 宠物很喜欢你'}
          {pet.trust_level > 40 && pet.trust_level <= 60 && '😐 宠物对你还不够了解'}
          {pet.trust_level <= 40 && '😢 宠物需要更多关心'}
        </p>
      </div>

      {/* 进化进度 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>进化进度</h3>
        <EvolutionProgress currentForm={pet.current_form} totalKcal={pet.total_kcal} />
        {pet.current_form !== 'shiny_rabbit' && (
          <button
            className="button button-primary"
            onClick={handleCheckEvolution}
            style={{ width: '100%', marginTop: '16px' }}
          >
            检查进化条件
          </button>
        )}
        {pet.current_form === 'shiny_rabbit' && (
          <div style={{
            background: '#e8f5e9',
            padding: '12px',
            borderRadius: '8px',
            marginTop: '16px',
            textAlign: 'center',
            color: '#2e7d32'
          }}>
            ✨ 宠物已达到最终形态！
          </div>
        )}
      </div>

      {/* 宠物状态 */}
      <div className="card">
        <h3>宠物状态</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{
            background: '#f0f0f0',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏃</div>
            <div style={{ fontSize: '12px', color: '#666' }}>总运动量</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{pet.total_kcal}</div>
          </div>
          <div style={{
            background: '#f0f0f0',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>❤️</div>
            <div style={{ fontSize: '12px', color: '#666' }}>信任度</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{pet.trust_level}</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
};

export default PetDetailPage;

