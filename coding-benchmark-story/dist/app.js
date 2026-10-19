'use strict';

// Historical, read-only measurements. No model APIs are called by this site.
const models = [
  { name:'DeepSeek V4.1 Flash', short:'DeepSeek', color:'#a9c995', time:20.08, tools:312, cost:2.73, tokens:13051616, cache:98.26, errors:5 },
  { name:'GPT-6.1 Sol', short:'GPT', color:'#b7c9da', time:22.18, tools:113, cost:10.27, tokens:2358731, cache:89.00, errors:20 },
  { name:'GLM 5.3', short:'GLM', color:'#e3c783', time:30.88, tools:221, cost:5.35, tokens:5718247, cache:97.40, errors:19 },
  { name:'Claude Opus 5.5', short:'Opus', color:'#dca38c', time:26.14, tools:93, cost:29.02, tokens:3145548, cache:92.90, errors:1 },
];
const tasks = [
  ['F1','游标续跑','多来源分批抓取，从上次进度继续。'],
  ['F2','工具与审批','定时任务按目录、角色调用工具与处理审批。'],
  ['F3','每日岗位雷达','汇总岗位变化和招聘来源健康状态。'],
  ['B1','失败状态传播','抓取失败时，不误把已有岗位判为下线。'],
  ['B2','分页漂移恢复','分页重叠或遗漏时，有界重试，避免漏抓。'],
  ['B3','连接复用与重试','复用连接，并对瞬时网络错误有限重试。'],
];
const paths = {
  target:'<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="3" fill="currentColor"/>',
  clock:'<circle cx="32" cy="34" r="23"/><path d="M32 20v15l10 6M25 4h14M32 4v7"/>',
  coin:'<rect x="9" y="14" width="46" height="38" rx="7"/><path d="m24 25 8 8 8-8M32 33v12M25 35h14"/>',
  lock:'<rect x="15" y="28" width="34" height="27" rx="5"/><path d="M22 28V18a10 10 0 0 1 20 0v10M32 39v6"/>',
  file:'<path d="M16 6h22l12 13v39H16zM38 6v14h12M24 31h18M24 39h18M24 47h11"/>',
  check:'<circle cx="32" cy="32" r="25"/><path d="m20 32 9 9 17-19"/>',
  layers:'<path d="m6 22 26-15 26 15-26 15zM6 32l26 15 26-15M6 42l26 15 26-15"/>',
};
const icon = (name, cls='') => `<svg class="${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.file}</svg>`;
const shell = (id,tag,html,dark=false) => `<article class="scene ${dark?'closing-scene':''}" data-scene="${id}"><div class="scene-top"><span>CODING FIELD NOTES <span style="font-weight:400;opacity:.4;margin:0 14px">/</span> OPENCAREER</span><span class="tag">${tag}</span></div><div class="scene-inner">${html}</div><div class="scene-bottom"><span>真实项目 · 统一方法 · 独立验收</span><span class="folio">${String(id+1).padStart(2,'0')} <span style="opacity:.4">/ 14</span></span></div></article>`;
const styleDelay = s => `style="--delay:${s}s"`;

const scenes = [
  {title:'先问一个问题',group:'01 / 为什么测',duration:14,note:'开场：我不想只看模型会不会写一道算法题。我想知道，在自己的真实项目里，它能不能把需求做完，又要花多少时间和钱。',render:()=>shell(0,'A REAL-WORLD EXPERIMENT',`
    <div class="two-col"><div class="hero-copy"><div class="hero-label eyebrow reveal">我的开源项目 × 四个模型</div><div class="hero-heading reveal" ${styleDelay(.1)}><h1>别只问 AI<br>会不会<span class="highlight">写代码。</span></h1></div><p class="subtitle reveal" ${styleDelay(.3)}>把它放进真实项目里。<br>看它能不能，真正把事做完。</p><div class="hero-stats reveal" ${styleDelay(.5)}><div><b>4</b><span>个模型</span></div><div><b>6</b><span>道工程任务</span></div><div><b>24</b><span>次独立执行</span></div></div></div><div class="hero-art"><div class="orbit"></div><div class="orbit second"></div><div class="repo-book"><div class="book-meta">OPEN SOURCE / FIELD TEST</div><div class="book-code">&lt;/&gt;</div><div class="book-title">OpenCareer<br>招聘助手</div><div class="book-bottom">BACKEND DEVELOPMENT</div></div><div class="float-chip one"><span class="chip-check">✓</span>从真实需求出发</div><div class="float-chip two">3 个功能 + 3 个 Bug</div><div class="float-chip three">效果 / 时间 / 成本</div><svg class="hand-arrow" viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 10c80-30 110 55 35 65m0 0 14-22m-14 22 30 1"/></svg><span class="intro-kicker">一次可以复盘的实测 ↗</span></div></div>`)
  },
  {title:'先定义什么叫好',group:null,duration:14,note:'先讲标准：每类任务，我只看效果、时间、成本三个核心指标。工具调用、词元和缓存是解释差异的补充信息，不能只用“感觉很聪明”来评分。',render:()=>shell(1,'DEFINE SUCCESS',`
    <div class="principle-layout"><div><span class="eyebrow reveal">在开始之前</span><h2 class="reveal" style="margin-top:23px;--delay:.1s">什么样的模型，<br>才算<span class="highlight">好用？</span></h2><p class="subtitle reveal" ${styleDelay(.3)}>我只看三个核心指标。<br>先定标准，再看答案。</p><div class="extra-metrics reveal" ${styleDelay(.5)}>额外记录：工具调用 · 词元消耗 · 缓存命中率</div></div><div class="principle-list"><div class="principle-row reveal" ${styleDelay(.25)}><span class="metric-number">01</span>${icon('target','principle-icon')}<div><h3>效果</h3><p>功能做完了吗？测试通过了吗？</p></div></div><div class="principle-row reveal" ${styleDelay(.45)}><span class="metric-number">02</span>${icon('clock','principle-icon')}<div><h3>时间</h3><p>从开始执行，到提交答案用了多久？</p></div></div><div class="principle-row reveal" ${styleDelay(.65)}><span class="metric-number">03</span>${icon('coin','principle-icon')}<div><h3>成本</h3><p>完成相同任务，需要花多少钱？</p></div></div></div></div>`)
  },
  {title:'把项目变成考场',group:'02 / 怎么出题',duration:16,note:'项目是我自己的开源招聘助手 OpenCareer。我取功能新增和 Bug 修复任务，还原各题的起始代码，让模型从对应的相同基线开始。右侧是产品结构示意，不是线上真实岗位数据。',render:()=>shell(2,'START FROM A REAL PROJECT',`
    <div class="two-col"><div><span class="eyebrow reveal">我的项目 / OpenCareer</span><h2 class="reveal" style="margin-top:24px;--delay:.1s">把真实项目，<br>变成<span class="highlight">一张试卷。</span></h2><p class="subtitle reveal" ${styleDelay(.3)}>一个招聘助手的后台开发。<br>从已有代码出发，增加功能、修复问题。</p><div class="commit-strip reveal" ${styleDelay(.5)}><span class="commit-node"></span><i></i><span class="commit-node"></span><i></i><span class="commit-node current"></span><i></i><span class="commit-node"></span><i></i><span class="commit-node"></span></div><div class="commit-label"><span>真实开发历史</span><span>还原本题起点 ↗</span></div><span class="mini-tag">每道题，先固定代码基线和完成条件</span></div><div class="reveal" ${styleDelay(.35)}><div class="app-demo"><div class="app-top"><i></i><i></i><i></i><span>OpenCareer · 产品结构示意</span></div><div class="app-body"><div class="app-nav"><div class="app-logo">◈ OpenCareer</div><div class="selected">岗位总览</div><div>招聘来源</div><div>任务调度</div><div>每日雷达</div></div><div class="app-main"><h3>让求职，井然有序。</h3><div class="app-stats"><div class="app-stat"><span>多来源采集</span><b>↗</b></div><div class="app-stat"><span>任务自动化</span><b>◷</b></div><div class="app-stat"><span>岗位变化</span><b>≋</b></div></div><div class="job-row"><i></i><div>来源 A · 增量同步<small>从上次游标继续获取</small></div><em>更新中</em></div><div class="job-row"><i style="background:#efe2cd"></i><div>来源 B · 健康检查<small>追踪采集状态与异常</small></div><em>正常</em></div><div class="job-row"><i style="background:#e4dcd4"></i><div>每日雷达 · 摘要生成<small>把岗位变化变成可读信息</small></div><em>已生成</em></div></div></div></div><p class="project-caption">界面为讲解示意。测试对象是后台逻辑。</p></div></div>`)
  },
  {title:'六道题，各考什么',group:null,duration:24,note:'功能题：多来源游标续跑、定时任务工具与审批、每日岗位雷达。修复题：抓取失败状态传播、分页漂移恢复、连接复用与重试。不是六次提交，而是六道独立任务。',render:()=>shell(3,'THE SIX TASKS',`
    <div class="tasks-header"><h2 class="reveal">六道题，<span class="highlight">两类能力。</span></h2><p class="subtitle reveal">新增功能 3 题 · 修复问题 3 题</p></div><div class="task-columns">${[0,1].map((type)=>`<div><div class="task-column-header"><span class="dot" style="background:${type?'#d59a7e':'#9dbb89'}"></span>${type?'修好已有问题':'把新需求做出来'}<span>${type?'BUG FIX':'FEATURE'}</span></div>${tasks.slice(type*3,type*3+3).map((t,j)=>`<div class="task-card ${type?'bug':''} reveal" style="--delay:${.15+j*.15+type*.1}s"><span class="task-id">${t[0]}</span><div class="task-copy"><h3>${t[1]}</h3><p>${t[2]}</p></div></div>`).join('')}</div>`).join('')}</div><div class="task-foot"><i></i><span>同一题：相同起始代码 · 明确完成条件 · 独立验收</span><i></i></div>`)
  },
  {title:'统一模型的工具箱',group:'03 / 怎么公平地跑',duration:15,note:'这次使用轻量的 Pi 编程代理执行框架，工具只有读文件、写文件、编辑和终端执行。统一工具环境有助于观察模型差异，但结果仍受框架、服务和配置影响。',render:()=>shell(4,'ONE HARNESS · FOUR TOOLS',`
    <div class="two-col"><div><span class="eyebrow reveal">Pi Coding Agent / 编程代理执行框架</span><h2 class="reveal" style="margin-top:24px;--delay:.1s">给它们，<br><span class="highlight">同一个工具箱。</span></h2><p class="subtitle reveal" ${styleDelay(.3)}>读代码、写代码、编辑、运行命令。<br>让工具环境尽量一致。</p><p class="tiny-note reveal" ${styleDelay(.5)}>这是同一框架下的模型实测。<br>模型能力、执行框架与服务，仍会共同影响结果。</p></div><div class="tool-field"><div class="tool-circle"></div><div class="tool-center">π</div><div class="tool-tile reveal" ${styleDelay(.2)}><b>Read</b><span>读取文件</span></div><div class="tool-tile reveal" ${styleDelay(.4)}><b>Write</b><span>写入文件</span></div><div class="tool-tile reveal" ${styleDelay(.6)}><b>Edit</b><span>编辑代码</span></div><div class="tool-tile reveal" ${styleDelay(.8)}><b>Bash</b><span>终端执行</span></div></div></div>`)
  },
  {title:'出题和做题要隔离',group:null,duration:18,note:'让一个单独的代理编写并校准测试。四个做题模型使用独立工作区和新会话，只能看到本题基线与题面，不能看到隐藏测试、参考答案或其他模型答案。',render:()=>shell(5,'ISOLATION BY DESIGN',`
    <div class="isolation-head"><h2 class="reveal">出题的，<span class="accent-coral">不下场。</span></h2><p class="subtitle reveal">做题模型看不到隐藏测试，也看不到彼此的答案。</p></div><div class="isolation-grid"><div class="judge-box reveal" ${styleDelay(.2)}><span class="eyebrow">独立出题代理</span>${icon('lock','judge-lock')}<h3>写题 · 校准 · 判题</h3><div class="file">hidden_tests.py<small>隐藏验收测试</small></div><div class="file">reference.patch<small>参考答案与基线验证</small></div></div><div class="boundary"><span class="boundary-label">信息隔离边界</span><div class="model-lanes">${models.map((m,i)=>`<div class="model-lane reveal" style="--model-color:${m.color};--delay:${.3+i*.12}s"><span class="lane-icon">${['D','G','Z','✳'][i]}</span><h3>${m.name}</h3><p>独立工作区 + 新会话</p></div>`).join('')}</div></div></div><div class="isolation-footer"><span>相同题目基线</span><span>仅提供本题任务</span><span>互不读取答案</span></div>`)
  },
  {title:'四模型，独立执行',group:null,duration:17,note:'四模型各自完成六道题，总共二十四次独立有效执行。每题记录全过程：响应、工具、修改、耗时和词元。这一幕的代码与亮灯是方法示意，不是现场调用，也不表示并发执行。',render:()=>shell(6,'24 INDEPENDENT RUNS',`
    <div class="run-head"><h2 class="reveal">四个模型。<span class="highlight">独立作答。</span></h2><p>每题只发起一次需求，不额外反馈修补答案。</p></div><div class="execution-layout"><div class="terminal reveal" ${styleDelay(.2)}><div class="terminal-top"><i></i><i></i><i></i><span>isolated workspace / F1</span></div><div class="terminal-body"><div class="terminal-line" style="--delay:0s"><span class="prompt">›</span>read collector.py</div><div class="terminal-line dim" style="--delay:.65s">理解采集逻辑与游标状态</div><div class="terminal-line" style="--delay:1.3s"><span class="prompt">›</span>edit cursor handling</div><div class="terminal-line dim" style="--delay:1.95s">实现增量续跑，保持原有行为</div><div class="terminal-line" style="--delay:2.6s"><span class="prompt">›</span>run project tests</div><div style="margin-top:15px;color:#a8c294">记录过程，封存答案 <span class="cursor"></span></div></div></div><div class="reveal" ${styleDelay(.35)}><div class="run-matrix">${models.map((m,i)=>`<div class="run-lane"><span class="run-model">${m.short}</span><div class="run-cells">${tasks.map((t,j)=>`<span class="run-cell" style="--delay:${-i*.4-j*.5}s">${t[0]}</span>`).join('')}</div></div>`).join('')}</div><div class="run-legend"><span><i></i>独立题目</span><span><i class="running"></i>工具执行示意</span></div><div class="demo-mark">流程动画 · 不是实况 · 不表示并发执行</div></div></div>`)
  },
  {title:'把判断交给测试',group:'04 / 怎么验收',duration:18,note:'模型自称完成不算验收。结束后封存代码，由独立流程运行隐藏测试和原有回归测试。测试有问题就独立校准，题面没说清的地方不苛扣；不向模型额外透露答案再返工。',render:()=>shell(7,'LET THE TESTS DECIDE',`
    <div class="scoring-layout"><div><span class="eyebrow reveal">模型说“完成”，还不够。</span><h2 class="reveal" style="margin-top:24px;--delay:.1s">把判断，<br>交给<span class="highlight">测试。</span></h2><p class="subtitle reveal" ${styleDelay(.3)}>新增能力要验收。<br>原有功能也不能被改坏。</p><p class="score-small reveal" ${styleDelay(.5)}>题目和测试必须一致。<br>题面含糊不苛扣，测试错误不归责模型。</p></div><div class="judge-flow"><div class="flow-node reveal" ${styleDelay(.2)}>${icon('file','flow-icon')}<div><h3>封存模型答案</h3><p>保留代码改动与完整执行记录</p></div></div><div class="flow-arrow">↓</div><div class="flow-node reveal" ${styleDelay(.45)}>${icon('layers','flow-icon')}<div><h3>独立运行验收</h3><p>隐藏测试 + 原有回归测试</p></div></div><div class="flow-arrow">↓</div><div class="flow-node reveal" ${styleDelay(.7)}>${icon('check','flow-icon')}<div><h3>记录通过 / 不通过</h3><p>按有效题面与验收标准判断</p></div></div></div></div>`)
  },
  {title:'先看完成了没有',group:null,duration:14,note:'在这次六道后台任务和有效验收标准下，四者都通过六题。这不是说明它们在所有工程场景里一样强，而是这套题目在完成率上的区分度已经有限。',render:()=>shell(8,'RESULT 01 / COMPLETION',`
    <div class="pass-head"><div><span class="eyebrow reveal">第一件事：效果</span><h2 class="reveal" style="margin-top:17px;--delay:.1s">这次，<span class="highlight">全部完成。</span></h2><p class="subtitle reveal" ${styleDelay(.3)}>同一组后台任务，四者均通过有效验收。</p></div><div class="big-six reveal" ${styleDelay(.4)}>6 / 6 <small>每个模型</small></div></div><table class="pass-matrix"><thead><tr><th>模型 / 任务</th>${tasks.map(t=>`<th>${t[0]}</th>`).join('')}</tr></thead><tbody>${models.map((m,i)=>`<tr><td><span class="pass-model" style="--model-color:${m.color}"><i class="model-dot"></i>${m.name}</span></td>${tasks.map((_,j)=>`<td><span class="check" style="--delay:${.4+i*.12+j*.08}s">✓</span></td>`).join('')}</tr>`).join('')}</tbody></table><div class="pass-foot"><span>通过范围：本次题面 + 有效测试</span><span>全对，说明这组任务的区分度有限。</span></div>`)
  },
  {title:'差异藏在效率里',group:'05 / 怎么读结果',duration:28,note:'这页可以切换时间、费用、工具调用、词元与缓存。DeepSeek Flash在本轮最快且估算费用最低，GPT词元最少，Opus工具调用最少。只比较本次任务，不直接推导综合能力排名。',render:()=>shell(9,'RESULT 02 / EFFICIENCY',`
    <div class="chart-head"><h2 class="reveal">差异，藏在<span class="highlight">效率里。</span></h2><div class="metric-switch" role="group" aria-label="选择比较指标">${['time','cost','tools','tokens','cache'].map((k,i)=>`<button data-metric="${k}" class="${i===0?'active':''}" aria-pressed="${i===0}">${['时间','费用','工具','词元','缓存'][i]}</button>`).join('')}</div></div><div id="metric-content"></div>`)
  },
  {title:'缓存，为什么重要',group:null,duration:17,note:'DeepSeek Flash本轮输入缓存命中率98.26%。缓存读取单价较低，所以词元多不一定费用高。缓存只反映输入复用，不代表正确率；其他模型截图口径和本轮接口口径不同，不做严格缓存优劣排名。',render:()=>shell(10,'A CLOSER LOOK / CACHE',`
    <div class="cache-layout"><div><span class="eyebrow reveal">解释成本差异的一条线索</span><h2 class="reveal" style="margin-top:24px;--delay:.1s">词元多，<br>不一定<span class="highlight">更贵。</span></h2><p class="subtitle reveal" ${styleDelay(.3)}>多轮工具执行会重复携带上下文。<br>缓存命中，让重复输入按较低单价计费。</p><p class="cache-note reveal" ${styleDelay(.5)}>缓存命中率 = 缓存输入 ÷ 总输入。<br>它不是正确率，也不是模型能力分数。<br>本轮 Flash 采用官方高峰单价估算费用。</p></div><div><div class="cache-donut"><svg viewBox="0 0 440 440" aria-hidden="true"><circle class="base" cx="220" cy="220" r="180"/><circle class="progress" cx="220" cy="220" r="180"/></svg><div class="donut-text"><b>98.26<span style="font-size:.43em">%</span></b><span>DeepSeek V4.1 Flash · 本轮</span></div></div><div class="cache-chips"><span class="pill"><i class="dot mint"></i>命中缓存 98.26%</span><span class="pill">未命中 1.74%</span></div><p class="cache-note" style="text-align:center;margin-left:auto;margin-right:auto">本轮有效六题输入记录。<br>其他模型来自平台截图，统计范围不同，不严格横比。</p></div></div>`)
  },
  {title:'工具调用，另一条线索',group:null,duration:17,note:'Opus只用了93次工具调用，比Flash的312次少。它有1次工具报错，不是零次；其余分别是Flash5次、GPT20次、GLM19次。少调用、少报错是值得关注的信号，但不能据此断言复杂工程一定最强。',render:()=>shell(11,'A CLOSER LOOK / TOOL USE',`
    <div class="two-col"><div><span class="eyebrow reveal">同样完成，路径可能不同。</span><h2 class="reveal" style="margin-top:24px;--delay:.1s">少走几步，<br>也是<span class="highlight">一种能力。</span></h2><div class="efficiency-stat reveal" ${styleDelay(.3)}><b>93</b><span>次工具调用 / Opus</span></div><p class="tiny-note reveal" ${styleDelay(.5)}>工具调用少，不直接等于代码更好。<br>但它能提示：谁用更少的动作完成了相同任务。</p></div><div><div class="tool-bars">${[...models].sort((a,b)=>a.tools-b.tools).map((m,i)=>`<div class="tool-bar-row" style="--model-color:${m.color}"><span class="tool-model">${m.short}</span><span class="tool-bar-line"><i style="--width:${m.tools/312*100}%;--delay:${.3+i*.15}s"></i></span><b>${m.tools}</b></div>`).join('')}</div><div class="tool-summary">本轮工具报错：Opus 1 次，Flash 5 次，<br>GPT 20 次，GLM 19 次。<br><span style="font-size:.85em;opacity:.8">报错可能包含可恢复的命令失败，不等于题目失败。</span></div></div></div>`)
  },
  {title:'结果，怎么用来选模型',group:null,duration:17,note:'我的选型判断：类似这组简单后台需求、预算或速度优先时，偏向DeepSeek Flash；Opus工具调用最少，值得在复杂任务继续验证，但本轮费用最高。速度排序Flash、GPT、Opus、GLM，不是综合能力排行榜。',render:()=>shell(12,'TURN RESULTS INTO DECISIONS',`
    <div class="conclusion-layout"><div class="conclusion-left"><span class="eyebrow reveal">给这次实验一个准确的结论</span><h2 class="reveal" style="margin-top:24px;--delay:.1s">全对，<br>不代表<span class="highlight">没有差距。</span></h2><p class="subtitle reveal" ${styleDelay(.3)}>这次实测的速度排序：<br>DeepSeek → GPT → Opus → GLM</p><div class="quote-line reveal" ${styleDelay(.5)}>它回答的是：这组任务，怎么选。<br>还不能回答：所有场景，谁最强。</div></div><div><div class="conclusion-card reveal" ${styleDelay(.25)}><span class="eyebrow">速度 / 预算优先</span><span class="outline-star">✳</span><h3>DeepSeek V4.1 Flash</h3><p>20.08 分钟 · 估算 ¥2.73<br>本轮最快，也最便宜。</p></div><div class="conclusion-card opus reveal" style="min-height:230px;margin-top:20px;--delay:.5s"><span class="eyebrow">继续观察工程效率</span><h3>Claude Opus 5.5</h3><p>93 次工具调用，四者最少。<br>但本轮估算费用最高：¥29.02。</p></div></div></div>`)
  },
  {title:'模型变强，评测也要变',group:'06 / 下一步',duration:22,note:'当简单任务都能完成，不能只保留这套题。增加跨模块、并发、恢复；测试多轮和长上下文；增加工具；加入模糊需求澄清；每题重复多次看稳定性。新的要求提前定义，不回头给旧答案加考题。',render:()=>shell(13,'THE NEXT BENCHMARK',`
    <div class="future-head"><h2 class="reveal">模型变强，<span class="highlight">题目也要升级。</span></h2><p class="subtitle reveal">让评测继续有区分度。</p></div><div class="future-grid">${[
      ['复杂度','跨模块联动、并发、异常恢复。'],['多轮与上下文','需求变更之后，还能保持正确吗？'],['更多工具','选对技能，并连续、深入地调用。'],['模糊需求','先澄清，再端到端满足需求。'],['重复与稳定性','每题多次运行，看成功率波动。']
    ].map((t,i)=>`<div class="future-card reveal" style="--delay:${.15+i*.12}s"><span class="future-num">0${i+1} /</span><h3>${t[0]}</h3><p>${t[1]}</p></div>`).join('')}<div class="future-card last reveal" ${styleDelay(.8)}>相同预算下，<br>谁能稳定完成更多？</div></div><p class="tiny-note" style="margin-top:25px;max-width:none">新标准提前定义，不对旧答案追加要求。让结论跟着证据走。</p>`)
  },
];
// The last scene doubles as a closing thought, without adding another chapter.
const closingRender = () => shell(13,'MAKE YOUR OWN FIELD TEST',`<div class="closing-layout"><div><span class="eyebrow" style="color:#9aaf8a">比一张排行榜更有价值的</span><h2 style="margin-top:25px">把任务交给模型。<br>把判断交给<span class="highlight">证据。</span></h2><p class="subtitle">从你最熟悉的项目开始，<br>做一次可以复盘的 Coding 评测。</p><div class="recipe"><span>选真实任务</span><span>独立执行</span><span>脚本验收</span><span>多维比较</span></div></div><div class="closing-illustration"><span class="closing-star">✳</span><div class="evidence-sheet"><span class="sheet-top">OPENCAREER / FIELD NOTES</span><h3>真实项目。<br>真实任务。<br>可复盘的结果。</h3><div class="sheet-line"></div><div class="sheet-line short"></div><div class="sheet-stamp">✓</div></div><span class="closing-chip">你的项目，就是下一张试卷。</span></div></div>`,true);

const metricConfig = {
 time:{label:'执行时间',unit:'分钟',winner:'DeepSeek V4.1 Flash',best:'20.08',statement:'同样完成，本轮 Flash 更快。',desc:'按六题有效执行时间累加；准备、预检与独立判题不计入。',foot:'总耗时为六题模型执行时间之和，不代表并发执行的墙钟时间。',format:v=>v.toFixed(2)},
 cost:{label:'人民币估算费用',unit:'元',winner:'DeepSeek V4.1 Flash',best:'2.73',statement:'本轮估算费用最低。',desc:'Flash 按官方高峰价计算。其余按截图与约定单价重算。',foot:'统一展示人民币估算费用，非账户实扣，也不是产品订阅价格。',format:v=>'¥'+v.toFixed(2)},
 tools:{label:'工具调用',unit:'次',winner:'Claude Opus 5.5',best:'93',statement:'Opus 用更少的动作完成。',desc:'工具调用数反映执行路径，不单独等于代码质量或模型能力。',foot:'统计本轮六题工具调用；可恢复的工具报错不等同于任务失败。',format:v=>v.toLocaleString('en-US')},
 tokens:{label:'词元消耗',unit:'万',winner:'GPT-6.1 Sol',best:'235.87',statement:'GPT 本轮词元消耗最少。',desc:'累计输入与输出词元；模型分词和缓存计价不同，费用不能只看总量。',foot:'展示累计词元消耗，包含重复上下文。实际成本还取决于输出占比与缓存。',format:v=>(v/10000).toFixed(2)+' 万'},
 cache:{label:'输入缓存命中率',unit:'%',winner:'DeepSeek V4.1 Flash',best:'98.26',statement:'解释成本的一条线索。',desc:'Flash 来自有效六题接口记录；其余为平台截图，统计范围不同。',foot:'口径不同，仅并列展示；不作严格缓存效率排名。缓存命中率不是正确率。',format:v=>v.toFixed(2)+'%'}
};

let current=0,elapsed=0,playing=false,speed=1,aspect='wide',metric='time',metricManual=false,closing=false,lastFrame=null;
const starts=scenes.map((_,i)=>scenes.slice(0,i).reduce((a,s)=>a+s.duration,0));
const total=scenes.reduce((a,s)=>a+s.duration,0);
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const fmt=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function renderChapters(){
 $('#chapters').innerHTML=scenes.map((s,i)=>`${s.group?`<div class="nav-group">${s.group}</div>`:''}<button class="nav-item ${i===current?'active':''}" data-scene-go="${i}" aria-label="第 ${i+1} 幕：${s.title}" ${i===current?'aria-current="step"':''}><span class="nav-no">${String(i+1).padStart(2,'0')}</span><span>${s.title}</span></button>`).join('');
}
function renderMetric(next=metric){
 metric=next;const c=metricConfig[metric],max=metric==='cache'?100:Math.max(...models.map(m=>m[metric]));
 const sorted=metric==='cache'?[...models]:[...models].sort((a,b)=>a[metric]-b[metric]);
 $('#metric-content').innerHTML=`<div class="chart-content"><div class="chart-callout"><div class="overline">${c.winner}</div><div class="value">${c.best}<small>${c.unit}</small></div><h3>${c.statement}</h3><p>${c.desc}</p></div><div class="bar-list">${sorted.map((m,i)=>`<div class="bar-row"><div class="bar-label"><span>${m.name}</span><b>${c.format(m[metric])}</b></div><div class="bar-track"><div class="bar-fill" style="--width:${m[metric]/max*100}%;--model-color:${m.color};--delay:${i*.1}s"></div></div></div>`).join('')}</div></div><p class="chart-foot">${c.foot}</p>`;
 $$('.metric-switch button').forEach(b=>{b.classList.toggle('active',b.dataset.metric===metric);b.setAttribute('aria-pressed',String(b.dataset.metric===metric));});
}
function renderScene(){
 $('#scene-content').innerHTML=closing?closingRender():scenes[current].render();
 $('#stage').classList.toggle('paused',!playing);
 if(current===9){metric='time';metricManual=false;renderMetric();}
 $('#scene-number').textContent=`${String(current+1).padStart(2,'0')} / 14`;
 $('#scene-label').textContent=closing?'把判断交给证据':scenes[current].title;
 $('#note-text').textContent=scenes[current].note;
 $('#previous').disabled=current===0&&!closing;
 $('#next').setAttribute('aria-label',current===13&&!closing?'查看收尾画面':closing?'回到开场':'下一幕');
 renderChapters();resize();updateTransport();
}
function updateTransport(){
 $('#timeline').value=String(elapsed/total*1000);$('#elapsed-label').textContent=fmt(elapsed);$('#duration-label').textContent=fmt(total);
 $('#play-label').textContent=playing?'暂停播放':elapsed>=total?'重新播放':'开始播放';$('#play-icon').textContent=playing?'Ⅱ':'▶';$('#play').setAttribute('aria-label',playing?'暂停播放':elapsed>=total?'重新播放':'开始播放');
}
function jump(index){current=Math.max(0,Math.min(scenes.length-1,index));elapsed=starts[current];closing=false;renderScene();}
function setPlaying(value){playing=value;lastFrame=null;$('#stage').classList.toggle('paused',!value);updateTransport();}
function togglePlay(){if(elapsed>=total){elapsed=0;current=0;closing=false;renderScene();}setPlaying(!playing);}
function seek(value){elapsed=Math.max(0,Math.min(total,value));const idx=starts.findLastIndex(t=>t<=elapsed);const newClosing=elapsed>=total;if(idx!==current||newClosing!==closing){current=idx;closing=newClosing;renderScene();}updateTransport();}
function next(){if(current===13&&!closing){elapsed=total;closing=true;setPlaying(false);renderScene();}else if(closing){jump(0);}else{jump(current+1);}}
function previous(){if(closing){jump(13);}else jump(current-1);}
function resize(){
 const v=$('#viewport'),frame=$('#frame'),stage=$('#stage');
 const size=aspect==='wide'?[1600,900]:aspect==='portrait'?[900,1600]:[900,1200];
 const padding=document.body.classList.contains('recording')||document.fullscreenElement===v?0:window.innerWidth<=800?16:28;
 const scale=Math.max(.01,Math.min((v.clientWidth-padding)/size[0],(v.clientHeight-padding)/size[1]));
 frame.style.width=`${size[0]*scale}px`;frame.style.height=`${size[1]*scale}px`;stage.style.transform=`scale(${scale})`;
}
function setAspect(value){aspect=value;$('#stage').classList.remove('wide','portrait','card');$('#stage').classList.add(value);$$('[data-aspect]').forEach(b=>{b.classList.toggle('active',b.dataset.aspect===value);b.setAttribute('aria-pressed',String(b.dataset.aspect===value));});resize();}
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400);}
function recording(force){const value=typeof force==='boolean'?force:!document.body.classList.contains('recording');document.body.classList.toggle('recording',value);resize();if(value)toast('已进入录屏模式 · H 或 Esc 退出 · 空格播放 / 暂停');}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('浏览器未允许全屏，可使用浏览器的全屏菜单。');}}
function showDialog(id){setPlaying(false);$(id).showModal();}

$('#chapters').addEventListener('click',e=>{const b=e.target.closest('[data-scene-go]');if(b)jump(Number(b.dataset.sceneGo));});
$('.brand').addEventListener('click',e=>{e.preventDefault();setPlaying(false);jump(0);});
$('#play').addEventListener('click',togglePlay);$('#next').addEventListener('click',next);$('#previous').addEventListener('click',previous);
$('#restart').addEventListener('click',()=>{jump(0);setPlaying(false);});
$('#timeline').addEventListener('input',e=>seek(Number(e.target.value)/1000*total));
$('#speed').addEventListener('change',e=>{speed=Number(e.target.value);});
$$('[data-aspect]').forEach(b=>b.addEventListener('click',()=>setAspect(b.dataset.aspect)));
$('#record-button').addEventListener('click',()=>recording());$('#leave-record').addEventListener('click',()=>recording(false));
$('#fullscreen').addEventListener('click',fullscreen);
$('#notes-button').addEventListener('click',()=>{const n=$('#notes');n.hidden=!n.hidden;$('#notes-button').setAttribute('aria-expanded',String(!n.hidden));resize();});
$('#scene-content').addEventListener('click',e=>{const b=e.target.closest('[data-metric]');if(b){metricManual=true;renderMetric(b.dataset.metric);}});
$('#data-button').addEventListener('click',()=>showDialog('#data-dialog'));$('#help-button').addEventListener('click',()=>showDialog('#help-dialog'));
$$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
document.addEventListener('keydown',e=>{
 if($$('dialog[open]').length||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.code==='Space'){e.preventDefault();togglePlay();}
 else if(e.key==='ArrowRight'){e.preventDefault();next();}
 else if(e.key==='ArrowLeft'){e.preventDefault();previous();}
 else if(e.key.toLowerCase()==='h')recording();
 else if(e.key.toLowerCase()==='f')fullscreen();
 else if(e.key==='Escape')recording(false);
 else if(e.key==='Home'){e.preventDefault();jump(0);setPlaying(false);}
});
document.addEventListener('fullscreenchange',resize);
document.addEventListener('visibilitychange',()=>{if(document.hidden){setPlaying(false);}});
new ResizeObserver(resize).observe($('#viewport'));
window.addEventListener('resize',resize);
$('#data-rows').innerHTML=models.map(m=>`<tr><td>${m.name}</td><td>6/6</td><td>${m.time.toFixed(2)}</td><td>${m.tools}</td><td>¥${m.cost.toFixed(2)}</td><td>${m.tokens.toLocaleString('en-US')}</td><td>${m.cache.toFixed(2)}%</td></tr>`).join('');
renderScene();
function tick(timestamp){
 if(playing){
   if(lastFrame!==null){
     // Bound a stalled tab's delta so switching windows never skips the story.
     elapsed=Math.min(total,elapsed+Math.min((timestamp-lastFrame)/1000,.15)*speed);
     const idx=starts.findLastIndex(t=>t<=elapsed);
     if(idx!==current){current=idx;closing=false;renderScene();}
     if(current===9&&!metricManual){const local=elapsed-starts[9],keys=['time','cost','tools','tokens','cache'];const key=keys[Math.min(4,Math.floor(local/5.6))];if(metric!==key)renderMetric(key);}
     if(elapsed>=total){closing=true;setPlaying(false);renderScene();}
     updateTransport();
   }
   lastFrame=timestamp;
 }else lastFrame=null;
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
