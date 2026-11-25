import os
D=os.path.dirname(os.path.abspath(__file__))
game=open('index.html',encoding='utf-8').read()
i=game.index('function weaverRows(pose)'); j=game.index('const spriteCache',i)
enemies="// the game's own enemy sprites, for the run mock\nconst pgRows = rows, pgEll = ell, pgLine = line, pgMirror = mirror;\n"+game[i:j]
js=''.join(open(os.path.join(D,f),encoding='utf-8').read()+'\n' for f in ['core.js','chars.js','props.js','tiles.js','icons.js','fx.js','ui.js','big.js','tree.js','hubwalk.js'])+enemies+open(os.path.join(D,'compose2.js'),encoding='utf-8').read()
page=open(os.path.join(D,'page2.html'),encoding='utf-8').read()+'\n<script>\n(() => {\n'+js+'\n})();\n</script>\n'
os.makedirs('design',exist_ok=True)
open('design/the-hollow.html','w',encoding='utf-8').write(page)
open('.claude/hollow-preview.html','w',encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'+page+'</html>')
print('built', len(page)//1024, 'KB')
