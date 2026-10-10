import sys, json, re, base64, os
src, out = sys.argv[1], sys.argv[2]
lines = open(src, encoding='utf-8').read().split('\n')
# lines[0] is the publisher wrapper; real doc spans lines 2..3736 (1-based)
doc = lines[1:3736]
head = doc[0:14]                 # doctype .. theme-preload script
css  = lines[16:2677]            # inside <style>
body = lines[2678:2920]          # </head> .. before data line
dataline = lines[2920]
scripts = lines[2921:3735]       # remaining <script> blocks
for d in ['assets/css','assets/js','assets/fonts','assets/images/projects','assets/images/services','assets/data']:
    os.makedirs(os.path.join(out,d), exist_ok=True)

# ---- fonts out of CSS
css_txt = '\n'.join(css)
fonts = {}
def font_sub(m):
    fam_weight = m.group(0)
    return fam_weight
def repl_font(m):
    block = m.group(0)
    w = re.search(r'font-weight:(\d+)', block).group(1)
    name = {'400':'NeueMontreal-Regular','500':'NeueMontreal-Medium'}.get(w, 'NeueMontreal-'+w)
    def u(mm):
        ext = mm.group(1)
        fn = f'{name}.{ext}'
        open(os.path.join(out,'assets/fonts',fn),'wb').write(base64.b64decode(mm.group(2)))
        return f'url(../fonts/{fn})'
    return re.sub(r'url\(data:font/(\w+);base64,([A-Za-z0-9+/=]+)\)', u, block)
css_txt = re.sub(r'@font-face\{[^}]*\}', repl_font, css_txt)
assert 'base64' not in css_txt
open(os.path.join(out,'assets/css/styles.css'),'w').write(css_txt.strip()+'\n')

# ---- data + images
a = dataline.index('>')+1; b = dataline.index('</script>')
data = json.loads(dataline[a:b])
ext = {'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','image/gif':'gif','image/avif':'avif'}
def save(uri, folder, stem):
    m = re.match(r'data:([^;]+);base64,(.*)$', uri, re.S)
    fn = f'{stem}.{ext[m.group(1)]}'
    open(os.path.join(out,folder,fn),'wb').write(base64.b64decode(m.group(2)))
    return f'{folder}/{fn}'
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-') or 'x'
for p in data.get('projects',[]):
    base = slug(p.get('name','')) + '-' + p['id']
    if p.get('cover') and str(p['cover'].get('src','')).startswith('data:'):
        p['cover']['src'] = save(p['cover']['src'],'assets/images/projects',base+'-cover')
    for k, imgs in (p.get('sections') or {}).items():
        for i, im in enumerate(imgs or []):
            if isinstance(im, dict) and str(im.get('src','')).startswith('data:'):
                im['src'] = save(im['src'],'assets/images/projects',f'{base}-{k}-{i+1}')
            elif isinstance(im,str) and im.startswith('data:'):
                imgs[i] = save(im,'assets/images/projects',f'{base}-{k}-{i+1}')
for k, v in list((data.get('serviceImages') or {}).items()):
    if isinstance(v,str) and v.startswith('data:'):
        data['serviceImages'][k] = save(v,'assets/images/services',slug(k))
left = json.dumps(data)
assert 'data:image' not in left, 'unhandled embedded image'
open(os.path.join(out,'assets/data/projects.json'),'w').write(json.dumps(data, indent=2, ensure_ascii=False)+'\n')
open(os.path.join(out,'assets/js/data.js'),'w').write(
 '// Portfolio content. Edit this file (or assets/data/projects.json, then copy it here) to add projects.\n'
 'window.TWIN_DATA = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n')

# ---- scripts
stxt = '\n'.join(scripts)
blocks = re.findall(r'<script>(.*?)</script>', stxt, re.S)
main_js = blocks[0]
main_js = main_js.replace('try { const el = document.getElementById("twin-data"); if (el) DATA = JSON.parse(el.textContent); } catch (e) {}',
  'try { if (window.TWIN_DATA) DATA = window.TWIN_DATA; else { const el = document.getElementById("twin-data"); if (el) DATA = JSON.parse(el.textContent); } } catch (e) {}')
assert 'window.TWIN_DATA' in main_js
open(os.path.join(out,'assets/js/app.js'),'w').write(main_js.strip('\n')+'\n')
extras = '\n\n'.join(x.strip('\n') for x in blocks[1:])
open(os.path.join(out,'assets/js/enhancements.js'),'w').write('// Small progressive enhancements (carousels, swipe navigation, scroll snapping, layout helpers).\n\n'+extras+'\n')

# ---- html
h = '\n'.join(head)
h += '\n<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n<link rel="stylesheet" href="assets/css/styles.css">\n'
h += '\n'.join(body) + '\n'
h += '<script src="assets/js/data.js"></script>\n<script src="assets/js/app.js"></script>\n<script src="assets/js/enhancements.js"></script>\n</body>\n</html>\n'
open(os.path.join(out,'index.html'),'w').write(h)
print('blocks', len(blocks), 'projects', len(data.get('projects',[])), 'keys', list(data.keys()))
