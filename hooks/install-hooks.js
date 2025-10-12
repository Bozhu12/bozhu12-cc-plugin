#!/usr/bin/env node
/**
 * Claude Code 插件 Hooks 安装脚本
 * 功能：将插件的 hooks.json 配置安装到 ~/.claude/settings.json
 * 特性：
 * - 跨平台支持 (Windows/Linux/macOS)
 * - 幂等性：重复执行不会重复添加
 * - 智能路径处理：自动适配平台路径格式
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ==================== 配置 ====================
const CONFIG = {
  // Claude 配置目录
  claudeDir: path.join(os.homedir(), '.claude'),
  // 插件目录（当前脚本所在目录的父目录）
  pluginDir: path.resolve(__dirname, '..'),
  // hooks 配置文件
  hooksConfigFile: path.join(__dirname, 'hooks.json'),
  // 设置文件
  settingsFile: null, // 运行时初始化
  // 备份设置
  enableBackup: true,
};

// 初始化 settingsFile 路径
CONFIG.settingsFile = path.join(CONFIG.claudeDir, 'settings.json');

// ==================== 工具函数 ====================

/**
 * 获取当前平台
 */
function getPlatform() {
  const platform = os.platform();
  if (platform === 'win32') return 'windows';
  if (platform === 'darwin') return 'macos';
  return 'linux';
}

/**
 * 获取平台特定的路径变量格式
 * Windows: %USERPROFILE%
 * Linux/macOS: $HOME 或 ~
 */
function getHomeVariable() {
  return getPlatform() === 'windows' ? '%USERPROFILE%' : '$HOME';
}

/**
 * 将绝对路径转换为相对于 HOME 的路径表示
 * 例如：C:\Users\Admin\.claude\plugins\xxx -> %USERPROFILE%\.claude\plugins\xxx
 */
function toRelativePath(absolutePath) {
  const homeDir = os.homedir();
  const homeVar = getHomeVariable();

  // 规范化路径分隔符
  let normalized = absolutePath.replace(/\\/g, '/');
  const normalizedHome = homeDir.replace(/\\/g, '/');

  if (normalized.startsWith(normalizedHome)) {
    let relative = normalized.slice(normalizedHome.length);
    if (relative.startsWith('/')) relative = relative.slice(1);

    // Windows 使用反斜杠
    if (getPlatform() === 'windows') {
      relative = relative.replace(/\//g, '\\');
      return `${homeVar}\\${relative}`;
    }

    // Linux/macOS 使用正斜杠
    return `${homeVar}/${relative}`;
  }

  return absolutePath;
}

/**
 * 解析模板变量
 * {{pluginDir}} -> 实际插件目录路径
 */
function resolveTemplate(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

/**
 * 读取 JSON 文件
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`⚠️  文件不存在: ${filePath}`);
      return null;
    }
    throw new Error(`读取文件失败 ${filePath}: ${error.message}`);
  }
}

/**
 * 写入 JSON 文件
 */
function writeJsonFile(filePath, data) {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * 备份文件
 */
function backupFile(filePath) {
  if (!CONFIG.enableBackup) return null;

  const backupPath = `${filePath}.backup.${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ 已备份: ${path.basename(backupPath)}`);
  return backupPath;
}

/**
 * 检查两个 hook 配置是否相同
 */
function isSameHook(hook1, hook2) {
  // 比较 type 和 command
  return hook1.type === hook2.type &&
         hook1.command === hook2.command;
}

/**
 * 查找并更新或添加 hook
 * 返回: { updated: boolean, added: boolean }
 */
function mergeHook(existingHooks, newHook) {
  // 查找是否已存在相同的 hook
  const index = existingHooks.findIndex(item =>
    item.hooks && item.hooks.length > 0 &&
    isSameHook(item.hooks[0], newHook)
  );

  if (index !== -1) {
    // 已存在，跳过
    return { updated: false, added: false };
  }

  // 不存在，添加新 hook
  existingHooks.push({ hooks: [newHook] });
  return { updated: false, added: true };
}

// ==================== 主逻辑 ====================

/**
 * 安装 hooks
 */
function installHooks() {
  console.log('🚀 Claude Code 插件 Hooks 安装器\n');

  // 1. 检查 hooks.json 是否存在
  if (!fs.existsSync(CONFIG.hooksConfigFile)) {
    console.error(`❌ 错误: 未找到 hooks.json\n   路径: ${CONFIG.hooksConfigFile}`);
    process.exit(1);
  }

  // 2. 读取 hooks.json
  console.log('📖 读取插件 hooks 配置...');
  const hooksConfig = readJsonFile(CONFIG.hooksConfigFile);
  if (!hooksConfig || !hooksConfig.hooks) {
    console.error('❌ 错误: hooks.json 格式无效');
    process.exit(1);
  }

  // 3. 读取或初始化 settings.json
  console.log('📖 读取 Claude Code 配置...');
  let settings = readJsonFile(CONFIG.settingsFile);
  if (!settings) {
    console.log('📝 创建新的 settings.json...');
    settings = {};
  }

  // 备份 settings.json
  if (fs.existsSync(CONFIG.settingsFile)) {
    backupFile(CONFIG.settingsFile);
  }

  // 4. 初始化 hooks 字段
  if (!settings.hooks) {
    settings.hooks = {};
  }

  // 5. 处理每个 hook 事件
  console.log('\n📦 安装 hooks...');

  const stats = {
    added: 0,
    updated: 0,
    skipped: 0,
  };

  const pluginDirRelative = toRelativePath(CONFIG.pluginDir);

  for (const [event, hooks] of Object.entries(hooksConfig.hooks)) {
    console.log(`\n  事件: ${event}`);

    // 初始化该事件的 hooks 数组
    if (!settings.hooks[event]) {
      settings.hooks[event] = [];
    }

    // 处理该事件下的每个 hook
    for (const hookDef of hooks) {
      // 解析模板变量
      const command = resolveTemplate(hookDef.command, {
        pluginDir: pluginDirRelative
      });

      const newHook = {
        type: hookDef.type || 'command',
        command: command,
      };

      // 合并 hook
      const result = mergeHook(settings.hooks[event], newHook);

      if (result.added) {
        stats.added++;
        console.log(`    ✅ 已添加: ${hookDef.name || command}`);
      } else if (result.updated) {
        stats.updated++;
        console.log(`    🔄 已更新: ${hookDef.name || command}`);
      } else {
        stats.skipped++;
        console.log(`    ⏭️  已存在: ${hookDef.name || command}`);
      }
    }
  }

  // 6. 写入 settings.json
  console.log('\n💾 保存配置...');
  writeJsonFile(CONFIG.settingsFile, settings);

  // 7. 输出结果
  console.log('\n✨ 安装完成!\n');
  console.log('📊 统计:');
  console.log(`   - 新增: ${stats.added}`);
  console.log(`   - 更新: ${stats.updated}`);
  console.log(`   - 跳过: ${stats.skipped}`);
  console.log(`\n📂 配置文件: ${CONFIG.settingsFile}`);

  if (stats.added > 0 || stats.updated > 0) {
    console.log('\n⚠️  提示: 请重启 Claude Code 以使 hooks 生效');
  }
}

// ==================== 入口 ====================

if (require.main === module) {
  try {
    installHooks();
  } catch (error) {
    console.error(`\n❌ 安装失败: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

module.exports = { installHooks };
