"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
// 数据存储路径
const dataDir = path_1.default.join(__dirname, '../data');
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
const usersFile = path_1.default.join(dataDir, 'users.json');
const petsFile = path_1.default.join(dataDir, 'pets.json');
const groupsFile = path_1.default.join(dataDir, 'groups.json');
const battlesFile = path_1.default.join(dataDir, 'battles.json');
const achievementsFile = path_1.default.join(dataDir, 'achievements.json');
// 初始化数据文件
const initDataFiles = () => {
    if (!fs_1.default.existsSync(usersFile))
        fs_1.default.writeFileSync(usersFile, JSON.stringify([]));
    if (!fs_1.default.existsSync(petsFile))
        fs_1.default.writeFileSync(petsFile, JSON.stringify([]));
    if (!fs_1.default.existsSync(groupsFile))
        fs_1.default.writeFileSync(groupsFile, JSON.stringify([]));
    if (!fs_1.default.existsSync(battlesFile))
        fs_1.default.writeFileSync(battlesFile, JSON.stringify([]));
    if (!fs_1.default.existsSync(achievementsFile)) {
        const achievements = [
            { id: (0, uuid_1.v4)(), name: '初出茅庐', type: 'battle', requirement: { battles: 1 }, reward_coins: 10 },
            { id: (0, uuid_1.v4)(), name: '战斗狂人', type: 'battle', requirement: { battles: 10 }, reward_coins: 50 },
            { id: (0, uuid_1.v4)(), name: '运动新手', type: 'exercise', requirement: { total_kcal: 100 }, reward_coins: 20 },
            { id: (0, uuid_1.v4)(), name: '运动达人', type: 'exercise', requirement: { total_kcal: 500 }, reward_coins: 50 },
        ];
        fs_1.default.writeFileSync(achievementsFile, JSON.stringify(achievements, null, 2));
    }
};
// 读写数据的辅助函数
const readData = (file) => {
    try {
        return JSON.parse(fs_1.default.readFileSync(file, 'utf-8'));
    }
    catch {
        return [];
    }
};
const writeData = (file, data) => {
    fs_1.default.writeFileSync(file, JSON.stringify(data, null, 2));
};
// 中间件
app.use(express_1.default.json());
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: '未授权' });
    }
    try {
        req.user = jsonwebtoken_1.default.verify(token, jwtSecret);
        next();
    }
    catch {
        res.status(401).json({ error: '令牌无效' });
    }
};
// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// 注册
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = readData(usersFile);
    if (users.some((u) => u.email === email)) {
        return res.status(400).json({ error: '邮箱已存在' });
    }
    const user = {
        id: (0, uuid_1.v4)(),
        username,
        email,
        password: bcryptjs_1.default.hashSync(password, 10),
        coins: 100,
        created_at: new Date()
    };
    users.push(user);
    writeData(usersFile, users);
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, jwtSecret);
    res.json({
        data: {
            user: { id: user.id, username: user.username, email: user.email },
            token
        }
    });
});
// 登录
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const users = readData(usersFile);
    const user = users.find((u) => u.email === email);
    if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
        return res.status(401).json({ error: '邮箱或密码错误' });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, jwtSecret);
    res.json({
        data: {
            user: { id: user.id, username: user.username, email: user.email },
            token
        }
    });
});
// 获取用户宠物
app.get('/api/users/pets', authMiddleware, (req, res) => {
    const pets = readData(petsFile);
    const userPets = pets.filter((p) => p.user_id === req.user.id);
    res.json(userPets);
});
// 创建宠物
app.post('/api/pets', authMiddleware, (req, res) => {
    const { name, personality, gender } = req.body;
    const pets = readData(petsFile);
    const pet = {
        id: (0, uuid_1.v4)(),
        user_id: req.user.id,
        name,
        personality,
        gender,
        current_form: 'lazy_bug',
        trust_level: 50,
        total_kcal: 0,
        created_at: new Date()
    };
    pets.push(pet);
    writeData(petsFile, pets);
    res.json(pet);
});
// 获取宠物详情
app.get('/api/pets/:id', authMiddleware, (req, res) => {
    const pets = readData(petsFile);
    const pet = pets.find((p) => p.id === req.params.id && p.user_id === req.user.id);
    if (!pet)
        return res.status(404).json({ error: '宠物不存在' });
    res.json(pet);
});
// 获取所有小组
app.get('/api/groups', authMiddleware, (req, res) => {
    const groups = readData(groupsFile);
    const groupsWithMembers = groups.map((g) => ({
        ...g,
        members: g.members || 0
    }));
    res.json(groupsWithMembers);
});
// 创建小组
app.post('/api/groups', authMiddleware, (req, res) => {
    const { name, difficulty, requiredKcalPerPerson, coinsPerPerson, deadline } = req.body;
    const groups = readData(groupsFile);
    const group = {
        id: (0, uuid_1.v4)(),
        creator_id: req.user.id,
        name,
        difficulty,
        required_kcal_per_person: requiredKcalPerPerson,
        coins_per_person: coinsPerPerson,
        deadline,
        max_members: 4,
        members: 0,
        status: 'recruiting',
        created_at: new Date()
    };
    groups.push(group);
    writeData(groupsFile, groups);
    res.json(group);
});
// 加入小组
app.post('/api/groups/:id/join', authMiddleware, (req, res) => {
    const groups = readData(groupsFile);
    const group = groups.find((g) => g.id === req.params.id);
    if (!group)
        return res.status(404).json({ error: '小组不存在' });
    group.members = (group.members || 0) + 1;
    writeData(groupsFile, groups);
    res.json({ message: '加入成功' });
});
// 获取排行榜
app.get('/api/leaderboard/kcal', authMiddleware, (req, res) => {
    const pets = readData(petsFile);
    const leaderboard = pets
        .sort((a, b) => b.total_kcal - a.total_kcal)
        .slice(0, 50)
        .map((p, index) => ({
        rank: index + 1,
        name: p.name,
        kcal: p.total_kcal
    }));
    res.json(leaderboard);
});
// 获取成就
app.get('/api/achievements', authMiddleware, (req, res) => {
    const achievements = readData(achievementsFile);
    res.json(achievements);
});
// 启动服务器
initDataFiles();
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 服务器运行在 http://0.0.0.0:${port}`);
});
//# sourceMappingURL=index-simple.js.map