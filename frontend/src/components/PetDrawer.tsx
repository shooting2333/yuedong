import React, { useEffect, useRef, useState } from 'react';

interface PetDrawerProps {
  form: string;
  trustLevel: number;
  onClick?: () => void;
  animated?: boolean;
}

export const PetDrawer: React.FC<PetDrawerProps> = ({ form, trustLevel, onClick, animated = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 60);
    }, 50);

    return () => clearInterval(interval);
  }, [animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 根据信任度改变背景颜色
    const bgColor = trustLevel > 70 ? '#fff9e6' : trustLevel > 40 ? '#f0f0f0' : '#ffe6e6';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 绘制不同形态的宠物
    switch (form) {
      case 'lazy_bug':
        drawLazyBug(ctx, centerX, centerY, trustLevel, animationFrame);
        break;
      case 'rabbit':
        drawRabbit(ctx, centerX, centerY, trustLevel, animationFrame);
        break;
      case 'deer':
        drawDeer(ctx, centerX, centerY, trustLevel, animationFrame);
        break;
      case 'shiny_rabbit':
        drawShinyRabbit(ctx, centerX, centerY, trustLevel, animationFrame);
        break;
      default:
        drawLazyBug(ctx, centerX, centerY, trustLevel, animationFrame);
    }

    // 绘制信任度条
    drawTrustBar(ctx, canvas.width, trustLevel);

    // 绘制心形（信任度高时）
    if (trustLevel > 60) {
      drawHearts(ctx, canvas.width, canvas.height, animationFrame);
    }
  }, [form, trustLevel, animationFrame]);

  return (
    <div
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{
          border: '2px solid #ddd',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
          marginBottom: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
};

// 绘制懒虫
function drawLazyBug(ctx: CanvasRenderingContext2D, x: number, y: number, trustLevel: number, frame: number) {
  // 呼吸动画
  const breathe = Math.sin(frame * 0.1) * 3;

  // 身体
  ctx.fillStyle = '#9b59b6';
  ctx.beginPath();
  ctx.ellipse(x, y + breathe, 50, 40 + breathe, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  const eyeOpacity = trustLevel > 50 ? 1 : 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${eyeOpacity})`;
  ctx.beginPath();
  ctx.arc(x - 15, y - 10 + breathe, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 15, y - 10 + breathe, 8, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔（跟随动画）
  const pupilOffset = Math.sin(frame * 0.15) * 2;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 15 + pupilOffset, y - 10 + breathe, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 15 + pupilOffset, y - 10 + breathe, 4, 0, Math.PI * 2);
  ctx.fill();

  // 嘴巴
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 15 + breathe, 15, 0, Math.PI);
  ctx.stroke();

  // 触角
  ctx.strokeStyle = '#9b59b6';
  ctx.lineWidth = 3;
  const antennaWave = Math.sin(frame * 0.12) * 10;
  ctx.beginPath();
  ctx.moveTo(x - 20, y - 40 + breathe);
  ctx.quadraticCurveTo(x - 30 + antennaWave, y - 60, x - 25, y - 75);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 20, y - 40 + breathe);
  ctx.quadraticCurveTo(x + 30 - antennaWave, y - 60, x + 25, y - 75);
  ctx.stroke();
}

// 绘制小兔子
function drawRabbit(ctx: CanvasRenderingContext2D, x: number, y: number, trustLevel: number, frame: number) {
  const bounce = Math.sin(frame * 0.1) * 5;

  // 身体
  ctx.fillStyle = '#ff9999';
  ctx.beginPath();
  ctx.ellipse(x, y + bounce, 45, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // 耳朵
  ctx.fillStyle = '#ff9999';
  ctx.beginPath();
  ctx.ellipse(x - 20, y - 40 + bounce, 15, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 20, y - 40 + bounce, 15, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // 耳朵内部
  ctx.fillStyle = '#ffcccc';
  ctx.beginPath();
  ctx.ellipse(x - 20, y - 35 + bounce, 8, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 20, y - 35 + bounce, 8, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 12, y - 5 + bounce, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 12, y - 5 + bounce, 8, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  const pupilOffset = Math.sin(frame * 0.15) * 2;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 12 + pupilOffset, y - 5 + bounce, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 12 + pupilOffset, y - 5 + bounce, 4, 0, Math.PI * 2);
  ctx.fill();

  // 鼻子
  ctx.fillStyle = '#ff6b9d';
  ctx.beginPath();
  ctx.arc(x, y + 10 + bounce, 5, 0, Math.PI * 2);
  ctx.fill();

  // 嘴巴
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 20 + bounce, 12, 0, Math.PI);
  ctx.stroke();

  // 前腿
  ctx.fillStyle = '#ff9999';
  ctx.fillRect(x - 20, y + 40 + bounce, 12, 25);
  ctx.fillRect(x + 8, y + 40 + bounce, 12, 25);
}

// 绘制小鹿
function drawDeer(ctx: CanvasRenderingContext2D, x: number, y: number, trustLevel: number, frame: number) {
  const bounce = Math.sin(frame * 0.1) * 4;

  // 身体
  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.ellipse(x, y + bounce, 50, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // 头
  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.arc(x, y - 30 + bounce, 25, 0, Math.PI * 2);
  ctx.fill();

  // 角
  ctx.strokeStyle = '#8b6f47';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 50 + bounce);
  ctx.lineTo(x - 20, y - 70 + bounce);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 50 + bounce);
  ctx.lineTo(x + 20, y - 70 + bounce);
  ctx.stroke();

  // 眼睛
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 10, y - 35 + bounce, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 10, y - 35 + bounce, 6, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  const pupilOffset = Math.sin(frame * 0.15) * 1.5;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 10 + pupilOffset, y - 35 + bounce, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 10 + pupilOffset, y - 35 + bounce, 3, 0, Math.PI * 2);
  ctx.fill();

  // 鼻子
  ctx.fillStyle = '#8b6f47';
  ctx.beginPath();
  ctx.arc(x, y - 20 + bounce, 4, 0, Math.PI * 2);
  ctx.fill();

  // 腿
  ctx.fillStyle = '#d4a574';
  ctx.fillRect(x - 25, y + 35 + bounce, 12, 30);
  ctx.fillRect(x - 5, y + 35 + bounce, 12, 30);
  ctx.fillRect(x + 15, y + 35 + bounce, 12, 30);
}

// 绘制闪闪兔
function drawShinyRabbit(ctx: CanvasRenderingContext2D, x: number, y: number, trustLevel: number, frame: number) {
  const bounce = Math.sin(frame * 0.1) * 5;
  const shine = Math.sin(frame * 0.2) * 0.5 + 0.5;

  // 身体
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.ellipse(x, y + bounce, 45, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // 闪光效果
  ctx.fillStyle = `rgba(255, 255, 255, ${shine * 0.6})`;
  ctx.beginPath();
  ctx.ellipse(x - 15, y - 10 + bounce, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // 耳朵
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.ellipse(x - 20, y - 40 + bounce, 15, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 20, y - 40 + bounce, 15, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // 耳朵内部
  ctx.fillStyle = '#fff9c4';
  ctx.beginPath();
  ctx.ellipse(x - 20, y - 35 + bounce, 8, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 20, y - 35 + bounce, 8, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 12, y - 5 + bounce, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 12, y - 5 + bounce, 8, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  const pupilOffset = Math.sin(frame * 0.15) * 2;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 12 + pupilOffset, y - 5 + bounce, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 12 + pupilOffset, y - 5 + bounce, 4, 0, Math.PI * 2);
  ctx.fill();

  // 鼻子
  ctx.fillStyle = '#ff6b9d';
  ctx.beginPath();
  ctx.arc(x, y + 10 + bounce, 5, 0, Math.PI * 2);
  ctx.fill();

  // 嘴巴
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 20 + bounce, 12, 0, Math.PI);
  ctx.stroke();

  // 前腿
  ctx.fillStyle = '#ffeb3b';
  ctx.fillRect(x - 20, y + 40 + bounce, 12, 25);
  ctx.fillRect(x + 8, y + 40 + bounce, 12, 25);

  // 星星装饰
  drawStars(ctx, x, y + bounce, frame);
}

// 绘制信任度条
function drawTrustBar(ctx: CanvasRenderingContext2D, width: number, trustLevel: number) {
  const barWidth = width - 20;
  const barHeight = 8;
  const x = 10;
  const y = 280;

  // 背景
  ctx.fillStyle = '#ddd';
  ctx.fillRect(x, y, barWidth, barHeight);

  // 进度
  const color = trustLevel > 70 ? '#51cf66' : trustLevel > 40 ? '#ff922b' : '#ff6b6b';
  ctx.fillStyle = color;
  ctx.fillRect(x, y, (barWidth * trustLevel) / 100, barHeight);

  // 边框
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, barWidth, barHeight);
}

// 绘制心形
function drawHearts(ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) {
  const heartCount = 3;
  for (let i = 0; i < heartCount; i++) {
    const offset = (frame + i * 20) % 60;
    const x = 50 + i * 100;
    const y = height - 50 - offset * 2;
    const opacity = Math.max(0, 1 - offset / 30);

    ctx.fillStyle = `rgba(255, 107, 157, ${opacity * 0.7})`;
    drawHeart(ctx, x, y, 8);
  }
}

// 绘制单个心形
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 2);
  ctx.bezierCurveTo(x - size, y - size / 2, x - size * 1.5, y, x, y + size);
  ctx.bezierCurveTo(x + size * 1.5, y, x + size, y - size / 2, x, y + size / 2);
  ctx.fill();
}

// 绘制星星
function drawStars(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const starCount = 4;
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2;
    const distance = 60 + Math.sin(frame * 0.1 + i) * 10;
    const sx = x + Math.cos(angle) * distance;
    const sy = y + Math.sin(angle) * distance;
    const opacity = Math.sin(frame * 0.15 + i) * 0.5 + 0.5;

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    drawStar(ctx, sx, sy, 5, 8, 4);
  }
}

// 绘制单个星星
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;

    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
