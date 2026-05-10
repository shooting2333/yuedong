import React, { useEffect, useRef } from 'react';

interface MonsterDrawerProps {
  name: string;
  healthPercent: number;
}

export const MonsterDrawer: React.FC<MonsterDrawerProps> = ({ name, healthPercent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 根据怪物名称绘制不同的怪物
    switch (name) {
      case '脂肪兽':
        drawFatBeast(ctx, centerX, centerY, healthPercent);
        break;
      case '懒癌小妖':
        drawLazyDemon(ctx, centerX, centerY, healthPercent);
        break;
      case '暴食魔':
        drawGluttonyDemon(ctx, centerX, centerY, healthPercent);
        break;
      case '周末大魔王':
        drawWeekendBoss(ctx, centerX, centerY, healthPercent);
        break;
      case '期末大魔王':
        drawFinalBoss(ctx, centerX, centerY, healthPercent);
        break;
      default:
        drawFatBeast(ctx, centerX, centerY, healthPercent);
    }

    // 绘制血条
    drawHealthBar(ctx, canvas.width, healthPercent);
  }, [name, healthPercent]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={350}
        style={{
          border: '2px solid #666',
          borderRadius: '10px',
          backgroundColor: '#1a1a2e',
          marginBottom: '10px'
        }}
      />
    </div>
  );
};

// 绘制脂肪兽
function drawFatBeast(ctx: CanvasRenderingContext2D, x: number, y: number, healthPercent: number) {
  // 身体
  ctx.fillStyle = '#90ee90';
  ctx.beginPath();
  ctx.ellipse(x, y, 60, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 20, y - 20, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 20, 12, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 20, y - 20, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 20, 6, 0, Math.PI * 2);
  ctx.fill();

  // 嘴巴
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y + 20, 15, 0, Math.PI);
  ctx.stroke();

  // 脂肪纹理
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(x, y + 30 + i * 15, 50 - i * 5, 0, Math.PI);
    ctx.stroke();
  }
}

// 绘制懒癌小妖
function drawLazyDemon(ctx: CanvasRenderingContext2D, x: number, y: number, healthPercent: number) {
  // 身体（蜷缩状）
  ctx.fillStyle = '#9b59b6';
  ctx.beginPath();
  ctx.ellipse(x, y + 20, 50, 40, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // 头
  ctx.fillStyle = '#9b59b6';
  ctx.beginPath();
  ctx.arc(x - 30, y - 20, 25, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛（半闭）
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(x - 40, y - 25, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - 20, y - 25, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 40, y - 25, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 20, y - 25, 3, 0, Math.PI * 2);
  ctx.fill();

  // 嘴巴（无力的）
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 30, y - 10, 8, Math.PI, 0);
  ctx.stroke();
}

// 绘制暴食魔
function drawGluttonyDemon(ctx: CanvasRenderingContext2D, x: number, y: number, healthPercent: number) {
  // 身体
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.ellipse(x, y, 65, 75, 0, 0, Math.PI * 2);
  ctx.fill();

  // 角
  ctx.fillStyle = '#cc0000';
  ctx.beginPath();
  ctx.moveTo(x - 30, y - 70);
  ctx.lineTo(x - 40, y - 100);
  ctx.lineTo(x - 20, y - 80);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + 30, y - 70);
  ctx.lineTo(x + 40, y - 100);
  ctx.lineTo(x + 20, y - 80);
  ctx.closePath();
  ctx.fill();

  // 眼睛（凶恶）
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 20, y - 15, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 15, 14, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 20, y - 15, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 15, 8, 0, Math.PI * 2);
  ctx.fill();

  // 大嘴巴
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y + 30, 30, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // 牙齿
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x - 20 + i * 10, y + 20, 6, 15);
  }
}

// 绘制周末大魔王
function drawWeekendBoss(ctx: CanvasRenderingContext2D, x: number, y: number, healthPercent: number) {
  // 身体
  ctx.fillStyle = '#4169e1';
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 70, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  // 头
  ctx.fillStyle = '#4169e1';
  ctx.beginPath();
  ctx.arc(x, y - 60, 40, 0, Math.PI * 2);
  ctx.fill();

  // 角（多个）
  ctx.fillStyle = '#1e40af';
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const startX = x + Math.cos(angle) * 40;
    const startY = y - 60 + Math.sin(angle) * 40;
    const endX = x + Math.cos(angle) * 70;
    const endY = y - 60 + Math.sin(angle) * 70;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1e40af';
    ctx.stroke();
  }

  // 眼睛（发光）
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(x - 20, y - 70, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 70, 12, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 20, y - 70, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 70, 6, 0, Math.PI * 2);
  ctx.fill();
}

// 绘制期末大魔王
function drawFinalBoss(ctx: CanvasRenderingContext2D, x: number, y: number, healthPercent: number) {
  // 发光效果
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x - 150, y - 150, 300, 300);

  // 身体
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.ellipse(x, y + 15, 75, 85, 0, 0, Math.PI * 2);
  ctx.fill();

  // 头
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(x, y - 65, 45, 0, Math.PI * 2);
  ctx.fill();

  // 皇冠
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.moveTo(x - 45, y - 65);
  ctx.lineTo(x - 30, y - 110);
  ctx.lineTo(x - 15, y - 85);
  ctx.lineTo(x, y - 115);
  ctx.lineTo(x + 15, y - 85);
  ctx.lineTo(x + 30, y - 110);
  ctx.lineTo(x + 45, y - 65);
  ctx.closePath();
  ctx.fill();

  // 眼睛（超发光）
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(x - 20, y - 75, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 75, 15, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 20, y - 75, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y - 75, 7, 0, Math.PI * 2);
  ctx.fill();

  // 星星装饰
  drawStar(ctx, x - 60, y - 30, 8, 5, 3);
  drawStar(ctx, x + 60, y - 30, 8, 5, 3);
  drawStar(ctx, x, y + 80, 8, 5, 3);
}

// 绘制星星
function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points: number, inset: number) {
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / points;

  ctx.moveTo(x, y - radius);
  for (let i = 0; i < points; i++) {
    ctx.lineTo(x + Math.cos(rot) * radius, y + Math.sin(rot) * radius);
    rot += step;
    ctx.lineTo(x + Math.cos(rot) * inset, y + Math.sin(rot) * inset);
    rot += step;
  }
  ctx.lineTo(x, y - radius);
  ctx.closePath();
  ctx.fill();
}

// 绘制血条
function drawHealthBar(ctx: CanvasRenderingContext2D, width: number, healthPercent: number) {
  const barWidth = width - 40;
  const barHeight = 15;
  const x = 20;
  const y = 20;

  // 背景
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, barWidth, barHeight);

  // 血条
  const fillWidth = (barWidth * healthPercent) / 100;
  ctx.fillStyle = healthPercent > 50 ? '#4caf50' : healthPercent > 25 ? '#ff9800' : '#f44336';
  ctx.fillRect(x, y, fillWidth, barHeight);

  // 边框
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barWidth, barHeight);

  // 百分比文字
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(healthPercent)}%`, x + barWidth / 2, y + 12);
}
