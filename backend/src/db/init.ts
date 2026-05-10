import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    console.log('初始化数据库...');

    // 用户表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        coins INT DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 宠物表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        personality VARCHAR(50) NOT NULL,
        gender VARCHAR(50) NOT NULL,
        current_form VARCHAR(50) NOT NULL DEFAULT 'lazy_bug',
        trust_level INT DEFAULT 50,
        total_kcal INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 怪物表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS monsters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        required_kcal INT NOT NULL,
        reward_coins INT NOT NULL,
        reward_fragments INT NOT NULL,
        image_url VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 战斗记录表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS battles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        monster_id UUID NOT NULL REFERENCES monsters(id),
        pet_id UUID NOT NULL REFERENCES pets(id),
        kcal_consumed INT DEFAULT 0,
        coins_earned INT DEFAULT 0,
        fragments_earned INT DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 小组表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        required_kcal_per_person INT NOT NULL,
        coins_per_person INT NOT NULL,
        max_members INT DEFAULT 4,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deadline TIMESTAMP NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'recruiting'
      )
    `);

    // 小组成员表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS group_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id),
        kcal_completed INT DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        UNIQUE(group_id, user_id)
      )
    `);

    // 装备表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS equipment (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        rarity VARCHAR(50) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 用户装备表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_equipment (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        equipment_id UUID NOT NULL REFERENCES equipment(id),
        quantity INT DEFAULT 1,
        equipped_on_pet BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 成就表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        requirement JSONB NOT NULL,
        reward_coins INT DEFAULT 10,
        icon VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 用户成就表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_id UUID NOT NULL REFERENCES achievements(id),
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      )
    `);

    // 用户统计表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_stats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        total_battles INT DEFAULT 0,
        total_wins INT DEFAULT 0,
        total_kcal INT DEFAULT 0,
        current_streak INT DEFAULT 0,
        level INT DEFAULT 1,
        experience INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ 数据库初始化成功');

    // 插入示例数据
    await insertSampleData();

    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    console.log('插入示例数据...');

    // 插入怪物
    const monsters = [
      {
        name: '脂肪兽',
        type: 'daily',
        required_kcal: 100,
        reward_coins: 10,
        reward_fragments: 1,
        description: '绿色，圆润可爱的小怪物'
      },
      {
        name: '懒癌小妖',
        type: 'daily',
        required_kcal: 50,
        reward_coins: 5,
        reward_fragments: 1,
        description: '紫色，蜷缩状的小妖怪'
      },
      {
        name: '暴食魔',
        type: 'daily',
        required_kcal: 150,
        reward_coins: 15,
        reward_fragments: 2,
        description: '红色，贪吃状的魔物'
      },
      {
        name: '周末大魔王',
        type: 'weekly',
        required_kcal: 500,
        reward_coins: 50,
        reward_fragments: 5,
        description: '蓝色，威武的大魔王'
      },
      {
        name: '期末大魔王',
        type: 'monthly',
        required_kcal: 1000,
        reward_coins: 100,
        reward_fragments: 10,
        description: '金色，超威武的终极Boss'
      }
    ];

    for (const monster of monsters) {
      await pool.query(
        `INSERT INTO monsters (name, type, required_kcal, reward_coins, reward_fragments, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [monster.name, monster.type, monster.required_kcal, monster.reward_coins, monster.reward_fragments, monster.description]
      );
    }

    // 插入装备
    const equipment = [
      { name: '运动头带', type: 'headband', rarity: 'common' },
      { name: '跑鞋皮肤', type: 'shoes', rarity: 'rare' },
      { name: '汗巾', type: 'towel', rarity: 'common' },
      { name: '护腕', type: 'wristband', rarity: 'rare' },
      { name: '运动裤', type: 'pants', rarity: 'epic' }
    ];

    for (const item of equipment) {
      await pool.query(
        `INSERT INTO equipment (name, type, rarity)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [item.name, item.type, item.rarity]
      );
    }

    // 插入成就
    const achievements = [
      { name: '初出茅庐', description: '完成第一场战斗', type: 'battle', requirement: { battles: 1 }, reward_coins: 10 },
      { name: '战斗狂人', description: '完成 10 场战斗', type: 'battle', requirement: { battles: 10 }, reward_coins: 50 },
      { name: '无敌战士', description: '完成 50 场战斗', type: 'battle', requirement: { battles: 50 }, reward_coins: 100 },
      { name: '运动新手', description: '累计运动 100 kcal', type: 'exercise', requirement: { total_kcal: 100 }, reward_coins: 20 },
      { name: '运动达人', description: '累计运动 500 kcal', type: 'exercise', requirement: { total_kcal: 500 }, reward_coins: 50 },
      { name: '运动大师', description: '累计运动 1000 kcal', type: 'exercise', requirement: { total_kcal: 1000 }, reward_coins: 100 },
      { name: '宠物饲养员', description: '创建第一只宠物', type: 'pet', requirement: { trust_level: 50 }, reward_coins: 15 },
      { name: '宠物进化师', description: '宠物进化一次', type: 'pet', requirement: { trust_level: 70 }, reward_coins: 30 },
      { name: '宠物收集家', description: '拥有 3 只宠物', type: 'pet', requirement: { trust_level: 80 }, reward_coins: 50 },
      { name: '社交蝴蝶', description: '加入一个小组', type: 'social', requirement: { coins: 100 }, reward_coins: 20 },
      { name: '团队合作', description: '完成一个小组任务', type: 'social', requirement: { coins: 200 }, reward_coins: 50 },
      { name: '每日签到', description: '连续签到 7 天', type: 'daily', requirement: { streak: 7 }, reward_coins: 30 },
      { name: '坚持不懈', description: '连续签到 30 天', type: 'daily', requirement: { streak: 30 }, reward_coins: 100 },
      { name: '幸运儿', description: '获得稀有装备', type: 'pet', requirement: { trust_level: 60 }, reward_coins: 40 },
      { name: '富豪', description: '拥有 500 虚拟币', type: 'social', requirement: { coins: 500 }, reward_coins: 50 }
    ];

    for (const achievement of achievements) {
      await pool.query(
        `INSERT INTO achievements (name, description, type, requirement, reward_coins)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [achievement.name, achievement.description, achievement.type, JSON.stringify(achievement.requirement), achievement.reward_coins]
      );
    }

    console.log('✅ 示例数据插入成功');
  } catch (error) {
    console.error('❌ 插入示例数据失败:', error);
  }
};

initDB();
