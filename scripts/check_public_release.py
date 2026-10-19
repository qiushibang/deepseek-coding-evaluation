#!/usr/bin/env python3
"""Check only the explicitly allowed public release; never print matched values."""
from pathlib import Path
from decimal import Decimal
import csv,json,re,subprocess

ROOT=Path(__file__).resolve().parents[1]
ALLOWED={
 '.gitignore','.gitattributes','.nojekyll','README.md','index.html',
 'assets/cover.png','assets/social-preview.jpg',
 'coding-benchmark-story/README.md','coding-benchmark-story/package.json',
 'coding-benchmark-story/讲解提纲.md','coding-benchmark-story/dist/index.html',
 'coding-benchmark-story/dist/styles.css','coding-benchmark-story/dist/app.js',
 'docs/tasks.md','docs/methodology.md','docs/metrics.md','docs/results.md',
 'docs/public-release.md','data/task-results.csv','data/model-summary.csv',
 'data/results.json','templates/task-template.md','scripts/check_public_release.py',
}
RULES={
 'api-key':r'(?i)(?:sk-(?:or-v1-)?[a-z0-9_-]{20,}|gh[pousr]_[a-z0-9]{20,}|github_pat_[a-z0-9_]{20,})',
 'private-key':r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
 'personal-machine-path':r'(?:/Users/|/home/|[A-Z]:\\Users\\)[^\s"<>]+',
 'private-host-or-employer':r'(?i)(?:bytedance|larkoffice\.com|feishu\.cn|chatgpt\.site|milanbcarsonzbuhlman)',
 'email':r'(?i)\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b',
}
# A parent repository must not be mistaken for the staging directory's repository.
has_git=(ROOT/'.git').exists()
if has_git:
 paths=subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode().split('\0')
 paths=[x for x in paths if x]
else:
 paths=[p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file()]
problems=[]
for name in paths:
 p=ROOT/name
 if name not in ALLOWED: problems.append((name,'outside-public-allowlist'));continue
 if p.is_symlink(): problems.append((name,'symbolic-link'));continue
 if p.suffix in {'.png','.jpg'}: continue
 text=p.read_text(encoding='utf-8')
 for label,pattern in RULES.items():
  # Rule definitions contain literal forbidden labels, not private content.
  if name== 'scripts/check_public_release.py': continue
  if re.search(pattern,text): problems.append((name,label))
 if p.suffix=='.md':
  for link in re.findall(r'\]\(([^)]+)\)',text):
   if re.match(r'(https?://|#|mailto:)',link):continue
   target=(p.parent/link.split('#')[0]).resolve()
   if not target.is_relative_to(ROOT) or not target.exists():problems.append((name,'invalid-local-link'))
for name in ALLOWED:
 if not (ROOT/name).is_file():problems.append((name,'missing-public-file'))
rows=list(csv.DictReader((ROOT/'data/task-results.csv').open()))
summaries=list(csv.DictReader((ROOT/'data/model-summary.csv').open()))
assert len(rows)==24 and len(summaries)==4
blob=json.loads((ROOT/'data/results.json').read_text())
assert len(blob['task_results'])==24
for summary in summaries:
 group=[r for r in rows if r['model']==summary['model']]
 assert {r['task_id'] for r in group}=={'F1','F2','F3','B1','B2','B3'} and len(group)==6
 assert sum(r['result']=='通过' for r in group)==int(summary['passed'])==6
 for field in ['minutes','estimated_cost_cny','tool_calls','total_tokens']:
  assert sum(Decimal(r[field]) for r in group)==Decimal(summary[field]),(summary['model'],field)
 published=next(r for r in blob['primary_models'] if r['model']==summary['model'])
 assert all(str(published[k])==summary[k] for k in summary)
 # The static slide values are rounded presentation copies, never a different dataset.
 js=(ROOT/'coding-benchmark-story/dist/app.js').read_text()
 match=re.search(r"name:'"+re.escape(summary['model'])+r"'[^\n]+",js)
 assert match
 for field,key,places in [('minutes','time',2),('tool_calls','tools',0),('estimated_cost_cny','cost',2),('total_tokens','tokens',0),('input_cache_hit_percent','cache',2)]:
  displayed=Decimal(re.search(r'\b'+key+r':([\d.]+)',match[0])[1])
  assert abs(displayed-Decimal(summary[field]))<=Decimal('0.5')*(Decimal(10)**-places)
print(json.dumps({'checked_files':len(paths),'valid_task_rows':len(rows),'valid_models':len(summaries),'findings':[{'path':p,'category':c} for p,c in problems]},ensure_ascii=False,indent=2))
raise SystemExit(bool(problems))
