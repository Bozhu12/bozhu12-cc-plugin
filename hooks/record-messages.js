#!/usr/bin/env node
/**
 * Claude Code 用户消息记录 Hook
 * 触发时机：用户提交消息时 (UserPromptSubmit Event)
 * 功能：记录用户发送的消息内容到 JSON 文件
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  claudeDir: path.join(process.env.USERPROFILE || process.env.HOME, '.claude'),
  outputFile: 'session-messages.json',
  timeFormat: 'HHmmss', // HHmm 或 HHmmss
  skipCommands: ['/clear'], // 跳过的命令
  enableDebugLog: false
};

/**
 * 调试日志
 */
function debug(message) {
  if (CONFIG.enableDebugLog) {
    const logFile = path.join(CONFIG.claudeDir, 'logs', 'record-messages.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  }
}

/**
 * 获取当前会话 ID
 */
function getCurrentSessionId() {
  try {
    const latestLink = path.join(CONFIG.claudeDir, 'debug', 'latest');

    if (!fs.existsSync(latestLink)) {
      debug('latest 软链接不存在');
      return null;
    }

    const targetPath = fs.readlinkSync(latestLink);
    const sessionId = path.basename(targetPath, '.txt');
    debug(`会话 ID: ${sessionId}`);
    return sessionId;
  } catch (error) {
    debug(`获取会话 ID 失败: ${error.message}`);
    return null;
  }
}

/**
 * 从 stdin 读取 hook 输入
 */
function readHookInput() {
  try {
    const inputData = fs.readFileSync(0, 'utf-8');
    if (!inputData || !inputData.trim()) {
      debug('Hook 输入为空');
      return null;
    }
    const hookInput = JSON.parse(inputData);
    debug(`Hook 输入: ${JSON.stringify(hookInput)}`);
    return hookInput;
  } catch (error) {
    debug(`读取 hook 输入失败: ${error.message}`);
    return null;
  }
}

/**
 * 格式化时间戳
 */
function formatTimestamp(timestamp, format = 'HHmmss') {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (format === 'HHmmss') {
    return hours + minutes + seconds;
  }
  return hours + minutes;
}

/**
 * 获取日期字符串
 */
function getDateString(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * 读取或初始化 JSON 数据
 */
function loadOrInitData(outputPath) {
  if (fs.existsSync(outputPath)) {
    try {
      const content = fs.readFileSync(outputPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      debug(`解析 JSON 失败，初始化新数据: ${error.message}`);
    }
  }

  return { sessionMsgs: {} };
}

/**
 * 原子写入 JSON 文件
 */
function atomicWriteJson(filePath, data) {
  const tmpFile = `${filePath}.tmp.${process.pid}.${Date.now()}`;

  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpFile, filePath);
    debug(`写入成功: ${filePath}`);
    return true;
  } catch (error) {
    debug(`写入失败: ${error.message}`);
    // 清理临时文件
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
    return false;
  }
}

/**
 * 检查是否应该跳过此消息
 */
function shouldSkipMessage(message) {
  // 跳过空消息
  if (!message || !message.trim()) {
    return true;
  }

  // 跳过配置中的命令
  for (const cmd of CONFIG.skipCommands) {
    if (message.trim().startsWith(cmd)) {
      debug(`跳过命令: ${cmd}`);
      return true;
    }
  }

  return false;
}

/**
 * 提取用户消息内容
 */
function extractUserMessage(hookInput) {
  // 尝试多种可能的字段名
  const possibleFields = [
    'message',
    'userMessage',
    'prompt',
    'text',
    'content',
    'display',
    'input'
  ];

  for (const field of possibleFields) {
    if (hookInput[field]) {
      return hookInput[field];
    }
  }

  // 如果都没有，返回 JSON 字符串作为后备
  debug('未找到标准消息字段，使用完整输入');
  return JSON.stringify(hookInput);
}

/**
 * 提取工作区路径
 */
function extractWorkspacePath(hookInput) {
  const possibleFields = ['project', 'workspace', 'workingDirectory', 'cwd', 'path'];

  for (const field of possibleFields) {
    if (hookInput[field]) {
      return hookInput[field];
    }
  }

  // 尝试从环境变量获取
  return process.cwd() || '';
}

/**
 * 主函数
 */
async function main() {
  try {
    debug('=== Hook 开始执行 (UserPromptSubmit) ===');

    // 1. 读取 hook 输入
    const hookInput = readHookInput();
    if (!hookInput) {
      debug('无法读取 hook 输入，退出');
      return;
    }

    // 2. 获取会话 ID
    const sessionId = getCurrentSessionId();
    if (!sessionId) {
      debug('无法获取会话 ID，退出');
      return;
    }

    // 3. 提取消息内容
    const userMessage = extractUserMessage(hookInput);
    if (shouldSkipMessage(userMessage)) {
      debug('跳过此消息');
      return;
    }

    // 4. 获取时间戳（使用当前时间）
    const timestamp = Date.now();
    const timeKey = formatTimestamp(timestamp, CONFIG.timeFormat);
    const dateStr = getDateString(timestamp);

    debug(`时间键: ${timeKey}, 日期: ${dateStr}, 消息: ${userMessage}`);

    // 5. 提取工作区路径
    const workspacePath = extractWorkspacePath(hookInput);

    // 6. 读取现有数据
    const outputPath = path.join(CONFIG.claudeDir, CONFIG.outputFile);
    const data = loadOrInitData(outputPath);

    // 7. 初始化会话数据
    if (!data.sessionMsgs[sessionId]) {
      data.sessionMsgs[sessionId] = {
        path: workspacePath,
        date: dateStr,
        _createdAt: timestamp
      };
      debug(`创建新会话记录: ${sessionId}`);
    }

    const sessionData = data.sessionMsgs[sessionId];

    // 8. 更新工作区路径（如果变化）
    if (workspacePath && sessionData.path !== workspacePath) {
      sessionData.path = workspacePath;
      debug(`更新工作区路径: ${workspacePath}`);
    }

    // 9. 去重检查（HHmmss 冲突的可能性很小，但仍需处理）
    if (sessionData[timeKey]) {
      let suffix = 1;
      let newTimeKey = `${timeKey}_${suffix}`;
      while (sessionData[newTimeKey]) {
        suffix++;
        newTimeKey = `${timeKey}_${suffix}`;
      }
      debug(`时间键冲突，使用: ${newTimeKey}`);
      sessionData[newTimeKey] = userMessage;
    } else {
      sessionData[timeKey] = userMessage;
    }

    // 10. 更新元数据
    sessionData._lastTimestamp = timestamp;
    sessionData._lastUpdated = Date.now();

    // 11. 原子写入
    if (atomicWriteJson(outputPath, data)) {
      debug('=== Hook 执行成功 ===');
    } else {
      debug('=== Hook 执行失败 ===');
    }

  } catch (error) {
    debug(`主函数异常: ${error.message}\n${error.stack}`);
  }
}

// 执行
if (require.main === module) {
  main().catch(error => {
    debug(`未捕获异常: ${error.message}`);
  });
}
