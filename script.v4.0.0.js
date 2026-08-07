'use strict';
// Updated to support Markdown content stored in either .md or .txt post files.
const $ = (s) => document.querySelector(s);
const root = document.documentElement;
const STORAGE_KEY = 'sazad-portfolio-appearance-v4';

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function safeURL(value = '') {
  const url = String(value).trim();
  return /^(https?:|mailto:|tel:)/i.test(url) || /^(?:\.\/)?assets\/[\w./%+() -]+$/i.test(url) ? url : '#';
}
async function getJSON(path) {
  const response = await fetch(`${path}?updated=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
async function getText(path) { const r = await fetch(`${path}?updated=${Date.now()}`, {cache:'no-store'}); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); }
function parsePost(source) {
  const parts = source.replace(/^\uFEFF/, '').match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/); if (!parts) throw new Error('Post front matter missing');
  const post = {tags:[], markdown:parts[2].trim()}; parts[1].split(/\r?\n/).forEach(line => { const i=line.indexOf(':'); if(i<0)return; const k=line.slice(0,i).trim(),v=line.slice(i+1).trim().replace(/^['"]|['"]$/g,''); post[k]=k==='tags'?v.replace(/^\[|\]$/g,'').split(',').map(x=>x.trim()).filter(Boolean):v; }); return post;
}
async function loadPosts() { const names=await getJSON('data/posts/index.json'); if(!Array.isArray(names))throw new Error('Post index must be a JSON array'); const posts=await Promise.all(names.map(async name=>{if(!/^[\w.-]+\.(?:md|txt)$/i.test(name))throw new Error(`Invalid post filename: ${name}`);const p=parsePost(await getText(`data/posts/${name}`));p.slug=p.slug||name.replace(/\.(?:md|txt)$/i,'');return p;})); return posts.sort((a,b)=>String(b.date).localeCompare(String(a.date))); }
function resolveMarkdownURL(value = '', context = null, image = false) {
  const url = String(value).trim().replace(/^<|>$/g, '');
  if (/^(https?:|mailto:|tel:|data:image\/)/i.test(url) || url.startsWith('#')) return url;
  // Blog posts are stored under data/posts but displayed by a root HTML page.
  // Their author-facing ../assets/... paths therefore need to be normalized
  // to the site's root assets directory before safeURL validates them.
  if (!context) {
    const localURL = url.replace(/^(?:\.\.\/)+(?=assets\/)/, '');
    return safeURL(localURL);
  }
  const pathEnd = url.search(/[?#]/);
  const rawPath = pathEnd < 0 ? url : url.slice(0, pathEnd);
  const suffix = pathEnd < 0 ? '' : url.slice(pathEnd);
  const clean = `${context.currentDir || ''}/${rawPath.replace(/^\.\//, '').replace(/^\//, '')}`.replace(/^\//, '');
  const encoded = clean.split('/').filter(Boolean).map(encodeURIComponent).join('/');
  return `${image ? context.rawBase : context.browseBase}/${encoded}${suffix}`;
}
function renderMarkdown(md = '', context = null) {
  const inline = source => {
    let value = escapeHTML(source);
    value = value.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g, (_, alt, url) => `<img src="${escapeHTML(resolveMarkdownURL(url, context, true))}" alt="${alt}" loading="lazy">`);
    value = value.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g, (_, label, url) => `<a href="${escapeHTML(resolveMarkdownURL(url, context, false))}" target="_blank" rel="noreferrer">${label}</a>`);
    return value.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
  };
  const splitRow = row => {
    const cells=[]; let cell='', escaped=false, code=false;
    const source=row.trim().replace(/^\|/,'').replace(/\|$/,'');
    for(const char of source){if(escaped){cell+=char;escaped=false;}else if(char==='\\'){escaped=true;cell+=char;}else if(char==='`'){code=!code;cell+=char;}else if(char==='|'&&!code){cells.push(cell.trim());cell='';}else cell+=char;}
    cells.push(cell.trim()); return cells;
  };
  const isDivider = line => {const cells=splitRow(line);return cells.length>0&&cells.every(cell=>/^:?-{1,}:?$/.test(cell.replace(/\s/g,'')));};
  const renderTable = rows => {
    const heads=splitRow(rows[0]),aligns=splitRow(rows[1]).map(cell=>{const value=cell.replace(/\s/g,'');return value.startsWith(':')&&value.endsWith(':')?'center':value.endsWith(':')?'right':'left';});
    const normalize=cells=>Array.from({length:heads.length},(_,i)=>cells[i]||'');
    const body=rows.slice(2).map(row=>`<tr>${normalize(splitRow(row)).map((cell,i)=>`<td style="text-align:${aligns[i]||'left'}">${inline(cell.replace(/\\\|/g,'|'))}</td>`).join('')}</tr>`).join('');
    return `<div class="markdown-table-wrap"><table><thead><tr>${heads.map((cell,i)=>`<th style="text-align:${aligns[i]||'left'}">${inline(cell.replace(/\\\|/g,'|'))}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
  };
  const lines=md.replace(/\r/g,'').split('\n'),blocks=[];let paragraph=[];
  const flush=()=>{if(paragraph.length){blocks.push({type:'block',value:paragraph.join('\n').trim()});paragraph=[];}};
  for(let i=0;i<lines.length;){const line=lines[i];
    if(line.trim().startsWith('```')){flush();const fence=line.trim().slice(3).trim();const code=[];i++;while(i<lines.length&&!lines[i].trim().startsWith('```'))code.push(lines[i++]);if(i<lines.length)i++;blocks.push({type:'code',value:code.join('\n'),language:fence});continue;}
    if(i+1<lines.length&&line.includes('|')&&isDivider(lines[i+1])){flush();const rows=[line,lines[i+1]];i+=2;while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()){rows.push(lines[i++]);}blocks.push({type:'table',rows});continue;}
    if(!line.trim()){flush();i++;continue;}paragraph.push(line);i++;
  }flush();
  return blocks.map(item=>{if(item.type==='table')return renderTable(item.rows);if(item.type==='code')return `<pre><code${item.language?` class="language-${escapeHTML(item.language)}"`:''}>${escapeHTML(item.value)}</code></pre>`;const b=item.value;const h=b.match(/^(#{1,6})\s+([\s\S]+)$/);if(h){const n=Math.min(h[1].length+1,6);return `<h${n}>${inline(h[2])}</h${n}>`;}if(/^!\[.*\]\(.+\)$/.test(b))return `<figure>${inline(b)}</figure>`;if(b.startsWith('> '))return `<blockquote><p>${inline(b.replace(/^>\s?/gm,''))}</p></blockquote>`;if(/^[-*+]\s+/m.test(b))return `<ul>${b.split('\n').map(x=>`<li>${inline(x.replace(/^[-*+]\s+/,''))}</li>`).join('')}</ul>`;if(/^\d+[.)]\s+/m.test(b))return `<ol>${b.split('\n').map(x=>`<li>${inline(x.replace(/^\d+[.)]\s+/,''))}</li>`).join('')}</ol>`;return `<p>${inline(b.replace(/\n/g,' '))}</p>`;}).join('');
}

async function loadPortfolio() {
  if (!$('#hero-name')) return;
  try {
    const keys = ['site','about','focus','skills','experience','projects','certifications','presentations','education','contact'];
    const values = await Promise.all(keys.map(key => getJSON(`data/${key}.json`)));
    const data = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
    const posts = await loadPosts();
    renderPortfolio(data, posts);
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML('afterbegin', '<div class="load-error">Content could not be loaded. Run a local web server instead of opening the HTML file directly.</div>');
  }
}
function renderPortfolio(data, posts) {
  const { site, about, focus = [], skills, experience, projects, certifications = [], presentations = [], education, contact } = data;
  $('#availability').textContent = site.availability;
  $('#hero-name').innerHTML = site.name.split(' ').map((p, i) => i ? `<span>${escapeHTML(p)}</span>` : escapeHTML(p)).join('<br>');
  $('#hero-role').textContent = site.role;
  $('#profile-image').src = site.profileImage;
  $('#hero-meta').innerHTML = `${escapeHTML(site.location)}<br>${site.languages.map(escapeHTML).join(' · ')}`;
  $('#hero-summary').textContent = site.summary;
  $('#about-heading').innerHTML = about.heading.map(escapeHTML).join('<br>');
  $('#about-copy').innerHTML = about.paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
  $('#stat-grid').innerHTML = about.stats.map(s => `<div><strong>${escapeHTML(s.value)}</strong><span>${escapeHTML(s.label)}</span></div>`).join('');
  $('#focus-list').innerHTML = focus.map((item, i) => `<article><span>0${i+1}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></article>`).join('');
  $('#skills-list').innerHTML = skills.map(s => `<div class="skill-row"><span>${escapeHTML(s.title)}</span><p>${s.items.map(escapeHTML).join(' · ')}</p></div>`).join('');
  $('#experience-list').innerHTML = experience.map(x => `<article><div class="time">${escapeHTML(x.period)}</div><div><h3>${escapeHTML(x.role)}</h3><h4>${escapeHTML(x.company)}</h4><p>${escapeHTML(x.description)}</p></div></article>`).join('');
  $('#projects-list').innerHTML = projects.map((p, i) => `<a class="project-card ${i === 0 ? 'featured-project' : ''}" href="project.html?id=${i}"><div class="project-top"><span>${String(i+1).padStart(2,'0')}</span><span>View embedded ${escapeHTML(p.platform)} repo ↗</span></div><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description)}</p><div class="tags">${p.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div></a>`).join('');
  renderCredentials(certifications, presentations);
  $('#education-list').innerHTML = education.map(e => `<div><span>${escapeHTML(e.period)}</span><h3>${escapeHTML(e.qualification)}</h3><p>${escapeHTML(e.institution)}</p></div>`).join('');
  $('#latest-posts').innerHTML = posts.slice(0, 3).map(postCard).join('');
  $('#contact-eyebrow').textContent = contact.eyebrow;
  $('#contact-links').innerHTML = contact.links.map(l => `<a href="${safeURL(l.url)}" ${l.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>${escapeHTML(l.label)} ↗</a>`).join('');
  $('#footer-name').textContent = site.name;
}
function renderCredentials(certifications, presentations) {
  $('#certification-count').textContent = String(certifications.length).padStart(2, '0');
  $('#presentation-count').textContent = String(presentations.length).padStart(2, '0');
  $('#certifications-list').innerHTML = certifications.length ? certifications.map(c => credentialCard(c, true)).join('') : '<div class="empty-card"><strong>Details coming soon.</strong><p>Add verified certifications in <code>data/certifications.json</code>. Nothing unverified has been published.</p></div>';
  $('#presentations-list').innerHTML = presentations.length ? presentations.map(p => credentialCard(p, false)).join('') : '<div class="empty-card"><strong>No presentations published yet.</strong></div>';
}
function credentialCard(item, certification) {
  const body = `<div class="credential-meta"><span>${escapeHTML(item.year || '')}</span><span>${escapeHTML(item.type || item.issuer || '')}</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description || '')}</p>${certification && item.credentialId ? `<small>Credential: ${escapeHTML(item.credentialId)}</small>` : ''}`;
  const href=certification?`certificate.html?id=${encodeURIComponent(item.credentialId||item.title)}`:`presentation.html?id=${encodeURIComponent(item.id||item.title)}`;
  return item.url ? `<a class="credential-card" href="${href}">${body}<span class="card-arrow">${certification?'View certificate':'Presentation viewer'} ↗</span></a>` : `<article class="credential-card">${body}</article>`;
}
function postCard(post) {
  return `<a class="post-card" href="post.html?slug=${encodeURIComponent(post.slug)}"><div class="post-meta"><span>${escapeHTML(post.category)}</span><span>${formatDate(post.date)}</span></div><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.excerpt)}</p><div class="post-footer"><span>${escapeHTML(post.readTime)}</span><span>Read article ↗</span></div></a>`;
}
function formatDate(date) {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? escapeHTML(date) : parsed.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'});
}

async function loadBlog() {
  if (!$('#all-posts')) return;
  try {
    const posts = await loadPosts();
    const categories = ['All', ...new Set(posts.map(p => p.category))];
    let active = 'All';
    const search = $('#post-search');
    $('#post-filters').innerHTML = categories.map(c => `<button type="button" data-filter="${escapeHTML(c)}" class="${c === 'All' ? 'active' : ''}">${escapeHTML(c)}</button>`).join('');
    const render = () => {
      const term = search.value.trim().toLowerCase();
      const filtered = posts.filter(p => (active === 'All' || p.category === active) && `${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase().includes(term));
      $('#all-posts').innerHTML = filtered.length ? filtered.map((p, i) => `<article class="blog-row"><div><span>${String(i+1).padStart(2,'0')}</span><span>${formatDate(p.date)}</span></div><a href="post.html?slug=${encodeURIComponent(p.slug)}"><h2>${escapeHTML(p.title)}</h2><p>${escapeHTML(p.excerpt)}</p><div class="tags">${p.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div></a><span>${escapeHTML(p.readTime)} ↗</span></article>`).join('') : '<div class="empty-card">No matching posts.</div>';
    };
    $('#post-filters').addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (!b) return; active = b.dataset.filter; document.querySelectorAll('[data-filter]').forEach(x => x.classList.toggle('active', x === b)); render(); });
    search.addEventListener('input', render);
    render();
  } catch (error) { console.error(error); }
}

async function loadArticle() {
  if (!$('#article')) return;
  try {
    const slug = new URLSearchParams(location.search).get('slug');
    const posts = await loadPosts();
    const post = posts.find(p => p.slug === slug) || posts[0];
    document.title = `${post.title} — Sazad Ahemad`;
    const content = renderMarkdown(post.markdown);
    $('#article').innerHTML = `<header class="article-header"><div class="post-meta"><span>${escapeHTML(post.category)}</span><span>${formatDate(post.date)} · ${escapeHTML(post.readTime)}</span></div><h1>${escapeHTML(post.title)}</h1><p>${escapeHTML(post.excerpt)}</p><div class="tags">${post.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div></header><div class="article-body">${content}</div>`;
  } catch (error) { console.error(error); }
}
async function loadCertificate(){if(!$('#certificate-view'))return;try{const certificates=await getJSON('data/certifications.json'),id=new URLSearchParams(location.search).get('id'),certificate=certificates.find(item=>(item.credentialId||item.title)===id)||certificates[0];if(!certificate||!certificate.url)throw new Error('Certificate not found');document.title=`${certificate.title} — Sazad Ahemad`;$('#certificate-view').innerHTML=`<header class="certificate-header"><span class="eyebrow">Verified certificate</span><h1>${escapeHTML(certificate.title)}</h1><p>${escapeHTML(certificate.issuer||'')}</p></header><div class="pdf-notice">View-only presentation. Download controls are hidden; public web files cannot be made impossible to save.</div><div class="pdf-frame-wrap" oncontextmenu="return false"><iframe title="${escapeHTML(certificate.title)}" src="${safeURL(certificate.url)}#toolbar=0&navpanes=0&scrollbar=1&view=FitH" loading="eager"></iframe></div>`;}catch(error){console.error(error);$('#certificate-view').innerHTML='<div class="load-error-inline">This certificate could not be loaded.</div>';}}

async function loadPresentation(){
  if(!$('#presentation-view'))return;
  try{
    const presentations=await getJSON('data/presentations.json');
    const id=new URLSearchParams(location.search).get('id');
    const presentation=presentations.find(item=>(item.id||item.title)===id)||presentations[0];
    const pdfURL=presentation?.pdfUrl||(/\.pdf(?:[?#].*)?$/i.test(presentation?.url||'')?presentation.url:'');
    if(!presentation||!pdfURL)throw new Error('Presentation PDF not configured');
    document.title=`${presentation.title} — Presentation Viewer`;
    $('#presentation-title').textContent=presentation.title;
    const frame=$('#presentation-frame');
    frame.title=`${presentation.title} — Presentation Viewer`;
    frame.src=`${safeURL(pdfURL)}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`;
  }catch(error){
    console.error(error);
    $('#presentation-stage').innerHTML='<div class="presentation-error"><strong>Presentation PDF unavailable.</strong><p>Upload the PDF file and set its path as <code>pdfUrl</code> in <code>data/presentations.json</code>.</p></div>';
  }
}

async function loadProject() {
  if (!$('#project-viewer')) return;
  try {
    const projects = await getJSON('data/projects.json');
    const id = Number(new URLSearchParams(location.search).get('id'));
    const project = projects[Number.isInteger(id) && projects[id] ? id : 0];
    document.title = `${project.title} — Sazad Ahemad`;
    const repo = parseRepository(project.url);
    $('#project-viewer').innerHTML = `<header class="project-detail-header"><div class="post-meta"><span>${escapeHTML(project.platform)}</span><span>Embedded repository</span></div><h1>${escapeHTML(project.title)}</h1><p>${escapeHTML(project.description)}</p><div class="tags">${project.tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div><a class="repo-external-link" href="${safeURL(project.url)}" target="_blank" rel="noreferrer">Open original repository ↗</a></header><section id="repo-embed" class="repo-embed"><div class="repo-loading">Loading repository details…</div></section>`;
    await renderRepository(repo, project.url);
  } catch (error) { console.error(error); $('#project-viewer').innerHTML = '<div class="load-error-inline">The project could not be loaded. Check the project JSON and repository URL.</div>'; }
}
function parseRepository(url) { const parsed=new URL(url); const parts=parsed.pathname.replace(/^\/+|\/+$/g,'').split('/'); if(parsed.hostname==='github.com'&&parts.length>=2)return{provider:'github',owner:parts[0],name:parts[1]}; if(parsed.hostname==='gitlab.com'&&parts.length>=2)return{provider:'gitlab',path:parts.join('/')}; throw new Error('Unsupported repository URL'); }
async function fetchRemoteJSON(url) { const response=await fetch(url,{cache:'no-store'}); if(!response.ok)throw new Error(`Repository API HTTP ${response.status}`); return response.json(); }
async function renderRepository(repo, originalURL) {
  const target=$('#repo-embed');
  try {
    let meta,readme='';
    if(repo.provider==='github'){const base=`https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}`;meta=await fetchRemoteJSON(base);try{const data=await fetchRemoteJSON(`${base}/readme`);readme=decodeURIComponent(escape(atob(data.content.replace(/\n/g,''))));}catch{}}
    else{const project=encodeURIComponent(repo.path);meta=await fetchRemoteJSON(`https://gitlab.com/api/v4/projects/${project}`);try{const branch=encodeURIComponent(meta.default_branch||'main');const response=await fetch(`https://gitlab.com/api/v4/projects/${project}/repository/files/README.md/raw?ref=${branch}`,{cache:'no-store'});if(response.ok)readme=await response.text();}catch{}}
    const description=meta.description||'Public source-code repository',stars=meta.stargazers_count??meta.star_count??0,forks=meta.forks_count??0;
    const branch=meta.default_branch||'main';
    const context=repo.provider==='github'
      ? {browseBase:`https://github.com/${repo.owner}/${repo.name}/blob/${encodeURIComponent(branch)}`,rawBase:`https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${encodeURIComponent(branch)}`}
      : {browseBase:`https://gitlab.com/${repo.path}/-/blob/${encodeURIComponent(branch)}`,rawBase:`https://gitlab.com/${repo.path}/-/raw/${encodeURIComponent(branch)}`};
    target.innerHTML=`<div class="repo-summary"><div><span>Repository</span><strong>${escapeHTML(repo.provider==='github'?`${repo.owner}/${repo.name}`:repo.path)}</strong></div><div><span>Stars</span><strong>${stars}</strong></div><div><span>Forks</span><strong>${forks}</strong></div></div><p class="repo-description">${escapeHTML(description)}</p><div class="repo-browser"><div class="repo-browser-head"><strong id="repo-path">Files /</strong><a href="${safeURL(originalURL)}" target="_blank" rel="noreferrer">Browse on ${escapeHTML(repo.provider)} ↗</a></div><div id="repo-files"></div></div><section id="repo-file-viewer" class="repo-file-viewer" hidden></section>${readme?`<section class="repo-readme"><div class="repo-browser-head"><strong>README.md</strong></div><div class="article-body">${renderMarkdown(readme,context)}</div></section>`:''}`;
    const viewFile=async(path,name)=>{const viewer=$('#repo-file-viewer');viewer.hidden=false;viewer.innerHTML='<div class="repo-loading">Loading file…</div>';viewer.scrollIntoView({behavior:'smooth',block:'start'});const encoded=path.split('/').map(encodeURIComponent).join('/');const rawURL=`${context.rawBase}/${encoded}`;const response=await fetch(rawURL,{cache:'no-store'});if(!response.ok)throw new Error(`File HTTP ${response.status}`);const ext=(name.split('.').pop()||'').toLowerCase(),imageTypes=['png','jpg','jpeg','gif','webp','svg','bmp','ico'];let content='';if(imageTypes.includes(ext)){content=`<div class="repo-image-preview"><img src="${escapeHTML(rawURL)}" alt="${escapeHTML(name)}"></div>`;}else if(['md','markdown'].includes(ext)){const fileContext={...context,currentDir:path.includes('/')?path.slice(0,path.lastIndexOf('/')):''};content=`<div class="article-body">${renderMarkdown(await response.text(),fileContext)}</div>`;}else if(['pdf','zip','gz','tar','7z','rar','exe','bin','ppt','pptx','doc','docx','xls','xlsx'].includes(ext)){content='<div class="repo-fallback"><p>This binary file cannot be rendered safely in the source viewer.</p></div>';}else{content=`<pre class="repo-code"><code>${escapeHTML(await response.text())}</code></pre>`;}viewer.innerHTML=`<div class="repo-browser-head"><strong>${escapeHTML(path)}</strong><button type="button" class="repo-close-file">Close ×</button></div>${content}`;};
    const loadDirectory=async(path='')=>{
      const list=$('#repo-files'),label=$('#repo-path');list.innerHTML='<div class="repo-loading">Loading folder…</div>';
      const encodedPath=path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
      const files=repo.provider==='github'?await fetchRemoteJSON(`https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`):await fetchRemoteJSON(`https://gitlab.com/api/v4/projects/${encodeURIComponent(repo.path)}/repository/tree?path=${encodeURIComponent(path)}&ref=${encodeURIComponent(branch)}&per_page=100`);
      label.textContent=`Files /${path?` ${path}`:''}`;const parent=path.includes('/')?path.slice(0,path.lastIndexOf('/')):'';
      const up=path?`<button class="repo-file repo-folder" type="button" data-repo-path="${escapeHTML(parent)}"><span>←</span><span>..</span></button>`:'';
      list.innerHTML=up+files.slice(0,100).map(file=>{const directory=file.type==='dir'||file.type==='tree',filePath=file.path||file.name;return directory?`<button class="repo-file repo-folder" type="button" data-repo-path="${escapeHTML(filePath)}"><span>□</span><span>${escapeHTML(file.name)}</span></button>`:`<button class="repo-file repo-view-file" type="button" data-repo-file="${escapeHTML(filePath)}" data-repo-name="${escapeHTML(file.name)}"><span>—</span><span>${escapeHTML(file.name)}</span></button>`;}).join('');
    };
    target.addEventListener('click',event=>{const folder=event.target.closest('[data-repo-path]');if(folder){loadDirectory(folder.dataset.repoPath).catch(error=>{console.error(error);$('#repo-files').innerHTML='<div class="repo-fallback">This folder could not be loaded. The repository API may be rate-limited.</div>';});return;}const file=event.target.closest('[data-repo-file]');if(file){viewFile(file.dataset.repoFile,file.dataset.repoName).catch(error=>{console.error(error);$('#repo-file-viewer').innerHTML='<div class="repo-fallback">This file could not be loaded. It may be too large, private, or temporarily rate-limited.</div>';});return;}if(event.target.closest('.repo-close-file')){$('#repo-file-viewer').hidden=true;}});
    await loadDirectory();
  } catch(error) { console.error(error); target.innerHTML=`<div class="repo-fallback"><h2>Repository preview unavailable</h2><p>The repository may be private, moved, rate-limited, or blocking API access. You can still open the original repository.</p><a class="repo-external-link" href="${safeURL(originalURL)}" target="_blank" rel="noreferrer">Open repository ↗</a></div>`; }
}

const defaultPrefs = { theme: 'light', scale: 'default', radius: 'soft', motion: true };
function getPrefs() { try { return {...defaultPrefs, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')}; } catch { return {...defaultPrefs}; } }
function savePrefs(prefs) { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); }
function resolvedTheme(theme) { return theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme; }
function applyPrefs(prefs) {
  root.dataset.themeChoice = prefs.theme; root.dataset.theme = resolvedTheme(prefs.theme); root.dataset.scale = prefs.scale; root.dataset.radius = prefs.radius; root.dataset.motion = prefs.motion ? 'on' : 'off';
  if ($('#motion-toggle')) $('#motion-toggle').checked = prefs.motion;
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = root.dataset.theme === 'dark' ? '#0a0a0a' : '#ffffff';
  document.querySelectorAll('[data-theme-option],[data-scale],[data-radius]').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-theme-option="${prefs.theme}"]`)?.classList.add('active'); document.querySelector(`[data-scale="${prefs.scale}"]`)?.classList.add('active'); document.querySelector(`[data-radius="${prefs.radius}"]`)?.classList.add('active');
}
function updatePrefs(patch) { const prefs = {...getPrefs(), ...patch}; savePrefs(prefs); applyPrefs(prefs); }
function setupAppearance() {
  applyPrefs(getPrefs());
  $('#theme-toggle')?.addEventListener('click', () => updatePrefs({theme: root.dataset.theme === 'dark' ? 'light' : 'dark'}));
  $('#customize-open')?.addEventListener('click', () => $('#customizer')?.showModal());
  document.querySelectorAll('[data-theme-option]').forEach(b => b.addEventListener('click', () => updatePrefs({theme:b.dataset.themeOption})));
  document.querySelectorAll('[data-scale]').forEach(b => b.addEventListener('click', () => updatePrefs({scale:b.dataset.scale})));
  document.querySelectorAll('[data-radius]').forEach(b => b.addEventListener('click', () => updatePrefs({radius:b.dataset.radius})));
  $('#motion-toggle')?.addEventListener('change', e => updatePrefs({motion:e.target.checked}));
  $('#reset-appearance')?.addEventListener('click', () => { savePrefs(defaultPrefs); applyPrefs(defaultPrefs); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (getPrefs().theme === 'system') applyPrefs(getPrefs()); });
}

document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
setupAppearance();
loadPortfolio();
loadBlog();
loadArticle();
loadProject();
loadCertificate();
loadPresentation();
