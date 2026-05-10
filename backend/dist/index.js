"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// 数据库连接
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 认证中间件
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: '未授权' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: '令牌无效' });
    }
};
// ==================== 认证相关 ====================
// 注册
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const userId = (0, uuid_1.v4)();
        await pool.query(`INSERT INTO users (id, username, email, password_hash, coins)
       VALUES ($1, $2, $3, $4, $5)`, [userId, username, email, passwordHash, 100]);
        const token = jsonwebtoken_1.default.sign({ id: userId, username, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user: { id: userId, username, email } });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 登录
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: '用户不存在' });
        }
        const user = result.rows[0];
        const isValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: '密码错误' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                coins: user.coins
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 宠物相关 ====================
// 创建宠物
app.post('/api/pets', authMiddleware, async (req, res) => {
    try {
        const { name, personality, gender } = req.body;
        const userId = req.user?.id;
        const petId = (0, uuid_1.v4)();
        await pool.query(`INSERT INTO pets (id, user_id, name, personality, gender, current_form, trust_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [petId, userId, name, personality, gender, 'lazy_bug', 50]);
        res.json({
            id: petId,
            name,
            personality,
            gender,
            current_form: 'lazy_bug',
            trust_level: 50,
            total_kcal: 0
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 获取宠物信息
app.get('/api/pets/:id', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [req.params.id, req.user?.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: '宠物不存在' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 获取用户的宠物
app.get('/api/users/pets', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pets WHERE user_id = $1', [req.user?.id]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 怪物相关 ====================
// 获取怪物列表
app.get('/api/monsters', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM monsters ORDER BY required_kcal ASC');
        res.json(result.rows);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 战斗相关 ====================
// 开始战斗
app.post('/api/battles', authMiddleware, async (req, res) => {
    try {
        const { monsterId, petId } = req.body;
        const userId = req.user?.id;
        const battleId = (0, uuid_1.v4)();
        await pool.query(`INSERT INTO battles (id, user_id, monster_id, pet_id, status)
       VALUES ($1, $2, $3, $4, $5)`, [battleId, userId, monsterId, petId, 'in_progress']);
        res.json({ id: battleId, status: 'in_progress' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 更新战斗进度
app.put('/api/battles/:id', authMiddleware, async (req, res) => {
    try {
        const { kcalConsumed } = req.body;
        const battleId = req.params.id;
        // 获取战斗信息
        const battleResult = await pool.query('SELECT * FROM battles WHERE id = $1 AND user_id = $2', [battleId, req.user?.id]);
        if (battleResult.rows.length === 0) {
            return res.status(404).json({ error: '战斗不存在' });
        }
        const battle = battleResult.rows[0];
        // 获取怪物信息
        const monsterResult = await pool.query('SELECT * FROM monsters WHERE id = $1', [battle.monster_id]);
        const monster = monsterResult.rows[0];
        const totalKcal = battle.kcal_consumed + kcalConsumed;
        const isCompleted = totalKcal >= monster.required_kcal;
        // 计算奖励
        const coinsEarned = isCompleted ? monster.reward_coins : 0;
        const fragmentsEarned = isCompleted ? monster.reward_fragments : 0;
        // 更新战斗
        await pool.query(`UPDATE battles
       SET kcal_consumed = $1, coins_earned = $2, fragments_earned = $3,
           status = $4, completed_at = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`, [
            totalKcal,
            coinsEarned,
            fragmentsEarned,
            isCompleted ? 'completed' : 'in_progress',
            isCompleted ? new Date() : null,
            battleId
        ]);
        // 如果战斗完成，更新用户虚拟币和宠物经验
        if (isCompleted) {
            await pool.query('UPDATE users SET coins = coins + $1 WHERE id = $2', [coinsEarned, req.user?.id]);
            await pool.query('UPDATE pets SET total_kcal = total_kcal + $1, trust_level = LEAST(100, trust_level + 5) WHERE id = $2', [totalKcal, battle.pet_id]);
            // 更新用户统计
            await updateUserStats(req.user?.id || '', true, totalKcal);
            // 检查宠物进化
            const evolutionResult = await checkPetEvolution(battle.pet_id);
            // 检查成就
            const newAchievements = await checkAchievements(req.user?.id || '');
            return res.json({
                kcalConsumed: totalKcal,
                coinsEarned,
                fragmentsEarned,
                isCompleted,
                status: 'completed',
                evolution: evolutionResult,
                newAchievements
            });
        }
        res.json({
            kcalConsumed: totalKcal,
            coinsEarned,
            fragmentsEarned,
            isCompleted,
            status: 'in_progress'
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 小组相关 ====================
// 创建小组
app.post('/api/groups', authMiddleware, async (req, res) => {
    try {
        const { name, difficulty, requiredKcalPerPerson, coinsPerPerson, deadline } = req.body;
        const creatorId = req.user?.id;
        const groupId = (0, uuid_1.v4)();
        await pool.query(`INSERT INTO groups (id, creator_id, name, difficulty, required_kcal_per_person, coins_per_person, deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [groupId, creatorId, name, difficulty, requiredKcalPerPerson, coinsPerPerson, deadline]);
        // 创建者自动加入
        await pool.query(`INSERT INTO group_members (group_id, user_id, status)
       VALUES ($1, $2, $3)`, [groupId, creatorId, 'pending']);
        res.json({ id: groupId, name, difficulty });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 获取小组详情
app.get('/api/groups', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        g.id,
        g.name,
        g.difficulty,
        g.required_kcal_per_person,
        g.coins_per_person,
        g.deadline,
        g.max_members,
        g.created_at,
        COUNT(gm.id) as member_count,
        u.username as creator_name
      FROM groups g
      LEFT JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN users u ON g.creator_id = u.id
      WHERE g.status = 'recruiting'
      GROUP BY g.id, u.id
      ORDER BY g.created_at DESC
      LIMIT 50
    `);
        const groups = result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            difficulty: row.difficulty,
            requiredKcalPerPerson: row.required_kcal_per_person,
            coinsPerPerson: row.coins_per_person,
            deadline: row.deadline,
            members: parseInt(row.member_count),
            maxMembers: row.max_members,
            creatorName: row.creator_name
        }));
        res.json(groups);
    }
    catch (error) {
        console.error('获取小组列表失败:', error);
        res.status(500).json({ error: '获取小组列表失败' });
    }
});
app.get('/api/groups/:id', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM groups WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: '小组不存在' });
        }
        const group = result.rows[0];
        // 获取成员列表
        const membersResult = await pool.query(`SELECT gm.*, u.username FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1`, [req.params.id]);
        res.json({ ...group, members: membersResult.rows });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 加入小组
app.post('/api/groups/:id/join', authMiddleware, async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.user?.id;
        await pool.query(`INSERT INTO group_members (group_id, user_id, status)
       VALUES ($1, $2, $3)`, [groupId, userId, 'pending']);
        res.json({ message: '加入成功' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 工具函数 ====================
// 宠物进化检查
const checkPetEvolution = async (petId) => {
    const pet = await pool.query('SELECT * FROM pets WHERE id = $1', [petId]);
    if (pet.rows.length === 0)
        return { evolved: false };
    const { current_form, total_kcal } = pet.rows[0];
    const evolutionMap = {
        lazy_bug: { threshold: 100, nextForm: 'rabbit' },
        rabbit: { threshold: 300, nextForm: 'deer' },
        deer: { threshold: 600, nextForm: 'shiny_rabbit' }
    };
    const evolution = evolutionMap[current_form];
    if (evolution && total_kcal >= evolution.threshold && current_form !== 'shiny_rabbit') {
        await pool.query('UPDATE pets SET current_form = $1 WHERE id = $2', [evolution.nextForm, petId]);
        return { evolved: true, newForm: evolution.nextForm };
    }
    return { evolved: false };
};
// 更新用户统计
const updateUserStats = async (userId, battleCompleted, kcalAdded) => {
    const today = new Date().toISOString().split('T')[0];
    const stats = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [userId]);
    if (stats.rows.length === 0) {
        await pool.query(`INSERT INTO user_stats (user_id, total_battles, total_wins, total_kcal, last_active_date, current_streak)
       VALUES ($1, $2, $3, $4, $5, $6)`, [userId, battleCompleted ? 1 : 0, battleCompleted ? 1 : 0, kcalAdded, today, 1]);
    }
    else {
        const lastDate = stats.rows[0].last_active_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = lastDate === yesterday ? stats.rows[0].current_streak + 1 : 1;
        await pool.query(`UPDATE user_stats SET total_battles = total_battles + $1, total_wins = total_wins + $2,
       total_kcal = total_kcal + $3, last_active_date = $4, current_streak = $5 WHERE user_id = $6`, [battleCompleted ? 1 : 0, battleCompleted ? 1 : 0, kcalAdded, today, newStreak, userId]);
    }
};
// 检查成就
const checkAchievements = async (userId) => {
    const stats = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [userId]);
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const pets = await pool.query('SELECT * FROM pets WHERE user_id = $1', [userId]);
    if (stats.rows.length === 0 || user.rows.length === 0)
        return [];
    const achievements = await pool.query('SELECT * FROM achievements');
    const unlockedIds = await pool.query('SELECT achievement_id FROM user_achievements WHERE user_id = $1', [userId]);
    const newAchievements = [];
    for (const achievement of achievements.rows) {
        if (unlockedIds.rows.some((u) => u.achievement_id === achievement.id))
            continue;
        const req = achievement.requirement;
        let unlocked = false;
        if (achievement.type === 'battle' && stats.rows[0].total_battles >= req.battles)
            unlocked = true;
        if (achievement.type === 'exercise' && stats.rows[0].total_kcal >= req.total_kcal)
            unlocked = true;
        if (achievement.type === 'pet' && pets.rows.some((p) => p.trust_level >= req.trust_level))
            unlocked = true;
        if (achievement.type === 'daily' && stats.rows[0].current_streak >= req.streak)
            unlocked = true;
        if (achievement.type === 'social' && user.rows[0].coins >= req.coins)
            unlocked = true;
        if (unlocked) {
            await pool.query('INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)', [userId, achievement.id]);
            await pool.query('UPDATE users SET coins = coins + $1 WHERE id = $2', [achievement.reward_coins, userId]);
            newAchievements.push(achievement);
        }
    }
    return newAchievements;
};
// ==================== 用户相关 API ====================
// 获取用户资料
app.get('/api/users/profile', authMiddleware, async (req, res) => {
    try {
        const user = await pool.query('SELECT id, username, email, coins, level, experience FROM users WHERE id = $1', [req.user?.id]);
        const stats = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [req.user?.id]);
        const pets = await pool.query('SELECT * FROM pets WHERE user_id = $1', [req.user?.id]);
        const achievements = await pool.query('SELECT COUNT(*) as count FROM user_achievements WHERE user_id = $1', [req.user?.id]);
        res.json({
            user: user.rows[0],
            stats: stats.rows[0] || null,
            pets: pets.rows,
            achievementCount: achievements.rows[0].count
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 获取用户统计
app.get('/api/users/stats', authMiddleware, async (req, res) => {
    try {
        const stats = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [req.user?.id]);
        res.json(stats.rows[0] || {});
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 宠物相关 API ====================
// 获取宠物详情
app.get('/api/pets/:id/detail', authMiddleware, async (req, res) => {
    try {
        const pet = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [req.params.id, req.user?.id]);
        if (pet.rows.length === 0) {
            return res.status(404).json({ error: '宠物不存在' });
        }
        res.json(pet.rows[0]);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 检查宠物进化
app.post('/api/pets/:id/check-evolution', authMiddleware, async (req, res) => {
    try {
        const pet = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [req.params.id, req.user?.id]);
        if (pet.rows.length === 0) {
            return res.status(404).json({ error: '宠物不存在' });
        }
        const result = await checkPetEvolution(req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 排行榜 API ====================
// 运动量排行榜
app.get('/api/leaderboard/kcal', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const offset = parseInt(req.query.offset) || 0;
        const leaderboard = await pool.query(`SELECT ROW_NUMBER() OVER (ORDER BY s.total_kcal DESC) as rank,
              u.username, s.total_kcal as value, u.level
       FROM user_stats s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.total_kcal DESC
       LIMIT $1 OFFSET $2`, [limit, offset]);
        res.json(leaderboard.rows);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 虚拟币排行榜
app.get('/api/leaderboard/coins', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const offset = parseInt(req.query.offset) || 0;
        const leaderboard = await pool.query(`SELECT ROW_NUMBER() OVER (ORDER BY u.coins DESC) as rank,
              u.username, u.coins as value, u.level
       FROM users u
       ORDER BY u.coins DESC
       LIMIT $1 OFFSET $2`, [limit, offset]);
        res.json(leaderboard.rows);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ==================== 成就 API ====================
// 获取所有成就
app.get('/api/achievements', authMiddleware, async (req, res) => {
    try {
        const achievements = await pool.query('SELECT * FROM achievements ORDER BY created_at');
        const unlockedIds = await pool.query('SELECT achievement_id FROM user_achievements WHERE user_id = $1', [req.user?.id]);
        const result = achievements.rows.map((a) => ({
            ...a,
            unlocked: unlockedIds.rows.some((u) => u.achievement_id === a.id)
        }));
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 获取用户已解锁成就
app.get('/api/achievements/user', authMiddleware, async (req, res) => {
    try {
        const achievements = await pool.query(`SELECT a.*, ua.unlocked_at FROM achievements a
       JOIN user_achievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = $1
       ORDER BY ua.unlocked_at DESC`, [req.user?.id]);
        res.json(achievements.rows);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 检查成就
app.post('/api/achievements/check', authMiddleware, async (req, res) => {
    try {
        const newAchievements = await checkAchievements(req.user?.id || '');
        res.json({ newAchievements });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// 启动服务器
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 服务器运行在 http://0.0.0.0:${port}`);
});
//# sourceMappingURL=index.js.map