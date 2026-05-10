import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { monsterAPI, battleAPI } from '../api';
import { MonsterDrawer } from '../components/MonsterDrawer';
import { Monster } from '../store';

interface BattlePageProps {
  onBack: () => void;
}

const BattlePage: React.FC<BattlePageProps> = ({ onBack }) => {
  const { monsters, pet, user, updateUserCoins, updatePetTrust } = useAppStore();
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [currentBattle, setCurrentBattle] = useState<any>(null);
  const [kcalInput, setKcalInput] = useState('');
  const [battleResult, setBattleResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 选择怪物
  const handleSelectMonster = async (monster: Monster) => {
    if (!pet) {
      alert('请先创建宠物');
      return;
    }

    try {
      setLoading(true);
      const response = await battleAPI.start(monster.id, pet.id);
      setSelectedMonster(monster);
      setCurrentBattle(response.data);
      setBattleResult(null);
      setKcalInput('');
    } catch (error: any) {
      alert(error.response?.data?.error || '开始战斗失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交卡路里
  const handleSubmitKcal = async () => {
    if (!kcalInput || !currentBattle) {
      alert('请输入卡路里数值');
      return;
    }

    try {
      setLoading(true);
      const response = await battleAPI.update(currentBattle.id, parseInt(kcalInput));

      if (response.data.isCompleted) {
        // 战斗完成
        updateUserCoins((user?.coins || 0) + response.data.coinsEarned);
        updatePetTrust(Math.min(100, (pet?.trust_level || 0) + 5));
        setBattleResult({
          ...response.data,
          monsterName: selectedMonster?.name,
          coinsEarned: response.data.coinsEarned,
          fragmentsEarned: response.data.fragmentsEarned
        });
      } else {
        // 战斗继续
        setCurrentBattle(response.data);
        setKcalInput('');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || '更新战斗失败');
    } finally {
      setLoading(false);
    }
  };

  if (!currentBattle) {
    // 怪物选择界面
    return (
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <button className="button button-secondary" onClick={onBack}>
            ← 返回
          </button>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>选择你的对手</h2>
          <div className="grid">
            {monsters.map((monster) => (
              <div
                key={monster.id}
                className="monster-card"
                onClick={() => handleSelectMonster(monster)}
              >
                <h3>{monster.name}</h3>
                <p>{monster.description}</p>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <p>需要: {monster.required_kcal} kcal</p>
                  <p>奖励: {monster.reward_coins} 币</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 战斗界面
  const healthPercent = selectedMonster
    ? (currentBattle.kcalConsumed / selectedMonster.required_kcal) * 100
    : 0;

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button className="button button-secondary" onClick={onBack}>
          ← 返回
        </button>
      </div>

      <div className="battle-screen">
        <h2 style={{ marginBottom: '20px' }}>⚔️ 战斗中</h2>

        {selectedMonster && (
          <MonsterDrawer
            name={selectedMonster.name}
            healthPercent={Math.min(100, healthPercent)}
          />
        )}

        <div className="battle-info">
          <p>已消耗: {currentBattle.kcalConsumed} / {selectedMonster?.required_kcal} kcal</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            进度: {Math.round(Math.min(100, healthPercent))}%
          </p>
        </div>

        {!battleResult ? (
          <div>
            <div className="kcal-input">
              <input
                type="number"
                value={kcalInput}
                onChange={(e) => setKcalInput(e.target.value)}
                placeholder="输入消耗的卡路里"
                min="0"
              />
              <button
                className="button button-primary"
                onClick={handleSubmitKcal}
                disabled={loading}
              >
                {loading ? '处理中...' : '提交'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              💡 提示: 输入你这次运动消耗的卡路里数值
            </p>
          </div>
        ) : (
          <div className="battle-result">
            <h3>🎉 战斗胜利!</h3>
            <p>击败了 {battleResult.monsterName}</p>
            <p>获得虚拟币: +{battleResult.coinsEarned}</p>
            <p>获得装备碎片: +{battleResult.fragmentsEarned}</p>
            <button
              className="button button-primary"
              onClick={() => {
                setCurrentBattle(null);
                setSelectedMonster(null);
                setBattleResult(null);
              }}
              style={{ marginTop: '15px', width: '100%' }}
            >
              继续冒险
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattlePage;
