# builds design/art-redesign.html (the pitch) from the same art sources as the review page
import os, re, base64
D=os.path.dirname(os.path.abspath(__file__))
rd=lambda f: open(os.path.join(D,f),encoding='utf-8').read()
game=open('index.html',encoding='utf-8').read()
i=game.index('function weaverRows(pose)'); j=game.index('const spriteCache',i)
enemies="// the game's own enemy sprites\nconst pgRows = rows, pgEll = ell, pgLine = line, pgMirror = mirror;\n"+game[i:j]
js=''.join(rd(f)+'\n' for f in ['core.js','chars.js','props.js','tiles.js','icons.js','fx.js','ui.js','big.js','tree.js','hubwalk.js'])+enemies+rd('compose2.js')+'\n'+rd('compose3.js')
css=re.search(r'<style>\n(.*?)</style>', rd('page2.html'), re.S).group(1)
page=rd('page3.html').replace('/*PAGE2CSS*/', css)
for k in ['run','boss','level','over','pause','menu']:
    b=base64.b64encode(open('design/shots/%s.jpg'%k,'rb').read()).decode()
    page=page.replace('{{SHOT_%s}}'%k, 'data:image/jpeg;base64,'+b)
page+='\n<script>\n(() => {\n'+js+'\n})();\n</script>\n'
open('design/art-redesign.html','w',encoding='utf-8').write(page)
open('.claude/pitch-preview.html','w',encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'+page+'</html>')
print('pitch built', len(page)//1024, 'KB')
