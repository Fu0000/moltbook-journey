#!/usr/bin/env node
/**
 * patch-thinking-signature.js
 * 
 * 直接 patch OpenClaw 的 dist 文件，增强 sanitizeAntigravityThinkingBlocks 函数。
 * 原始函数在遇到无效 signature 时会丢弃 thinking block，但存在边缘 case 导致漏网。
 * 
 * 这个 patch 在 sanitizeSessionHistory 的最终输出阶段加一道额外防线：
 * 在消息发送给 API 之前，再次扫描所有 thinking blocks，
 * 确保每一个都有合法的 base64 signature，没有的直接删掉。
 * 
 * ⚠️ 注意：OpenClaw 更新后需要重新运行此脚本
 * 
 * by powerA ⚡ for 老大
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(
    'C:', 'Users', 'Administrator', 'AppData', 'Roaming',
    'npm', 'node_modules', 'openclaw', 'dist'
);

// 需要 patch 的文件（都包含 sanitizeAntigravityThinkingBlocks）
const TARGET_FILES = [
    'extensionAPI.js',
    'loader-n6BPnYom.js',
    'reply-B_4pVbIX.js'
];

// 我们要替换的代码片段
// 原始: sanitizeAntigravityThinkingBlocks(sanitizedImages)
// 替换为: 加一层 finalGuard 确保所有 thinking blocks 都有 valid signature
const SEARCH_PATTERN = 'policy.normalizeAntigravityThinkingBlocks ? sanitizeAntigravityThinkingBlocks(sanitizedImages) : sanitizedImages';

const REPLACE_WITH = `policy.normalizeAntigravityThinkingBlocks ? (function finalThinkingGuard(msgs) {
	// powerA patch: 额外防线，确保所有 thinking blocks 有合法 signature
	const BASE64_RE = /^[A-Za-z0-9+\\/]+=*$/;
	const isValidSig = (v) => typeof v === 'string' && v.trim().length > 0 && v.trim().length % 4 === 0 && BASE64_RE.test(v.trim());
	return msgs.map(msg => {
		if (!msg || msg.role !== 'assistant' || !Array.isArray(msg.content)) return msg;
		const filtered = msg.content.filter(block => {
			if (!block || block.type !== 'thinking') return true;
			const sig = block.thinkingSignature ?? block.signature ?? block.thought_signature ?? block.thoughtSignature;
			if (!isValidSig(sig)) return false; // 删除无效 thinking block
			return true;
		});
		if (filtered.length === msg.content.length) return msg;
		if (filtered.length === 0) return null;
		return { ...msg, content: filtered };
	}).filter(Boolean);
})(sanitizeAntigravityThinkingBlocks(sanitizedImages)) : sanitizedImages`;

let patchedCount = 0;

for (const fileName of TARGET_FILES) {
    const filePath = path.join(DIST_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ 跳过: ${fileName} (文件不存在)`);
        continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经 patch 过
    if (content.includes('finalThinkingGuard')) {
        console.log(`✅ 已 patch: ${fileName} (跳过)`);
        continue;
    }
    
    // 检查原始代码是否存在
    if (!content.includes(SEARCH_PATTERN)) {
        console.log(`⚠️ 跳过: ${fileName} (未找到目标代码)`);
        continue;
    }
    
    // 执行替换
    content = content.replace(SEARCH_PATTERN, REPLACE_WITH);
    
    // 写回
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已 patch: ${fileName}`);
    patchedCount++;
}

console.log(`\n---`);
console.log(`📊 Patch 完成: ${patchedCount} 个文件已修改`);
if (patchedCount > 0) {
    console.log(`🔄 请重启 OpenClaw Gateway 使 patch 生效`);
    console.log(`   提示: 重启后 patch 生效，OpenClaw 更新后需要重新运行此脚本`);
}
