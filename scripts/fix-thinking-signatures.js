#!/usr/bin/env node
/**
 * fix-thinking-signatures.js
 * 
 * 清理 OpenClaw session JSONL 文件中有问题的 thinking blocks
 * - 删除没有 thinkingSignature 的 thinking blocks
 * - 删除 signature 为空字符串的 thinking blocks
 * - 删除 signature 格式不合法(非 base64)的 thinking blocks
 * 
 * 用法:
 *   node fix-thinking-signatures.js [--dry-run] [--session <id>]
 *   --dry-run    只检查不修改
 *   --session    指定 session id，不指定则扫描所有
 * 
 * by powerA ⚡ for 老大
 */

const fs = require('fs');
const path = require('path');

// --- 配置 ---
const SESSIONS_DIR = path.join('C:', 'Users', 'Administrator', '.openclaw', 'agents', 'main', 'sessions');
const BACKUP_SUFFIX = '.bak-thinking-fix';

// --- 参数解析 ---
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const sessionIdx = args.indexOf('--session');
const targetSession = sessionIdx !== -1 ? args[sessionIdx + 1] : null;

// --- Base64 验证 (和 OpenClaw 源码一致) ---
const BASE64_RE = /^[A-Za-z0-9+/]+=*$/;
function isValidBase64Signature(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.length % 4 !== 0) return false;
    return BASE64_RE.test(trimmed);
}

// --- 检查单个 content block ---
function isProblematicThinkingBlock(block) {
    if (!block || typeof block !== 'object') return false;
    if (block.type !== 'thinking') return false;
    
    // 获取所有可能的 signature 字段
    const sig = block.thinkingSignature ?? block.signature ?? block.thought_signature ?? block.thoughtSignature;
    
    if (!sig) {
        return { reason: 'no signature at all' };
    }
    if (typeof sig === 'string' && sig.trim() === '') {
        return { reason: 'empty signature' };
    }
    if (!isValidBase64Signature(sig)) {
        return { reason: `invalid signature format (len=${String(sig).length})` };
    }
    
    return false; // 正常
}

// --- 处理单个 JSONL 文件 ---
function processSessionFile(filePath) {
    const sessionId = path.basename(filePath, '.jsonl');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let totalThinkingBlocks = 0;
    let problematicBlocks = 0;
    let fixedLines = [];
    let modified = false;
    const issues = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) {
            fixedLines.push(line);
            continue;
        }
        
        let obj;
        try {
            obj = JSON.parse(line);
        } catch (e) {
            fixedLines.push(line);
            continue;
        }
        
        // 只处理有 message.content 数组的行
        if (!obj.message || !Array.isArray(obj.message.content)) {
            fixedLines.push(line);
            continue;
        }
        
        let lineModified = false;
        const newContent = [];
        
        for (let bi = 0; bi < obj.message.content.length; bi++) {
            const block = obj.message.content[bi];
            
            if (block && block.type === 'thinking') {
                totalThinkingBlocks++;
                const problem = isProblematicThinkingBlock(block);
                
                if (problem) {
                    problematicBlocks++;
                    lineModified = true;
                    modified = true;
                    issues.push({
                        line: i + 1,
                        blockIndex: bi,
                        reason: problem.reason,
                        thinkingPreview: (block.thinking || '').substring(0, 80)
                    });
                    // 跳过这个 block（不加入 newContent）
                    continue;
                }
            }
            newContent.push(block);
        }
        
        if (lineModified) {
            if (newContent.length === 0) {
                // 整个 content 都被清掉了，跳过这一行
                continue;
            }
            obj.message.content = newContent;
            fixedLines.push(JSON.stringify(obj));
        } else {
            fixedLines.push(line);
        }
    }
    
    return {
        sessionId,
        filePath,
        totalThinkingBlocks,
        problematicBlocks,
        modified,
        issues,
        fixedContent: fixedLines.join('\n')
    };
}

// --- 主函数 ---
function main() {
    console.log('🔍 OpenClaw Thinking Signature 清理工具');
    console.log(`📂 Sessions 目录: ${SESSIONS_DIR}`);
    console.log(`🔧 模式: ${dryRun ? '仅检查 (dry-run)' : '检查并修复'}`);
    console.log('---');
    
    if (!fs.existsSync(SESSIONS_DIR)) {
        console.error('❌ Sessions 目录不存在');
        process.exit(1);
    }
    
    // 找到要处理的 JSONL 文件
    let files;
    if (targetSession) {
        const f = path.join(SESSIONS_DIR, `${targetSession}.jsonl`);
        if (!fs.existsSync(f)) {
            console.error(`❌ Session 文件不存在: ${f}`);
            process.exit(1);
        }
        files = [f];
    } else {
        files = fs.readdirSync(SESSIONS_DIR)
            .filter(f => f.endsWith('.jsonl') && !f.endsWith('.lock'))
            .map(f => path.join(SESSIONS_DIR, f));
    }
    
    console.log(`📋 发现 ${files.length} 个 session 文件\n`);
    
    let totalFixed = 0;
    
    for (const file of files) {
        const result = processSessionFile(file);
        
        if (result.totalThinkingBlocks === 0) continue; // 跳过没有 thinking 的文件
        
        const status = result.problematicBlocks > 0 ? '⚠️' : '✅';
        console.log(`${status} ${result.sessionId}`);
        console.log(`   Thinking blocks: ${result.totalThinkingBlocks}, 问题: ${result.problematicBlocks}`);
        
        if (result.issues.length > 0) {
            for (const issue of result.issues) {
                console.log(`   🔴 行 ${issue.line}, block ${issue.blockIndex}: ${issue.reason}`);
                if (issue.thinkingPreview) {
                    console.log(`      预览: "${issue.thinkingPreview}..."`);
                }
            }
            
            if (!dryRun && result.modified) {
                // 备份原文件
                const backupPath = file + BACKUP_SUFFIX;
                fs.copyFileSync(file, backupPath);
                // 写入修复后的文件
                fs.writeFileSync(file, result.fixedContent, 'utf8');
                console.log(`   ✅ 已修复! 备份: ${path.basename(backupPath)}`);
                totalFixed++;
            }
        }
        console.log('');
    }
    
    console.log('---');
    console.log(`📊 总计: 扫描 ${files.length} 个文件, ${totalFixed} 个需要修复`);
    if (dryRun && totalFixed === 0) {
        console.log('💡 提示: 使用不带 --dry-run 参数运行来执行修复');
    }
}

main();
