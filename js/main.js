var textarea = document.querySelector('#input'),
    packButton = document.querySelector('button'),
    outputContainer = document.querySelector('#output'),

    sampleText = "b.innerHTML = \"JavaScript Source<br><textarea rows=12 cols=80></textarea><br><button>CRUSH</button> <b></b><br><textarea rows=12 cols=80></textarea>\" + b.innerHTML;Q=[];for (i=1000;--i;i-10&&i-13&&i-34&&i-39&&i-92&&Q.push(String.fromCharCode(i)));L=b.children[3].onclick=function(s){i=s=b.children[1].value.replace(/([\\r\\n]|^)\\s*\\/\\/.*|[\\r\\n]+\\s*\/g,'').replace(/\\\\/g,'\\\\\\\\'),X=B=s.length/2,O=m='';for(S=encodeURI(i).replace(/%../g,'i').length;;m=c+m){for(M=N=e=c=0,i=Q.length;!c&&--i;!~s.indexOf(Q[i])&&(c=Q[i]));if(!c)break;if(O){o={};for(x in O)for(j=s.indexOf(x),o[x]=0;~j;o[x]++)j=s.indexOf(x,j+x.length);O=o;}else for(O=o={},t=1;X;t++)for(X=i=0;++i<s.length-t;)if(!o[x=s.substr(j=i,t)])if(~(j=s.indexOf(x,j+t)))for(X=t,o[x]=1;~j;o[x]++)j=s.indexOf(x,j+t);for(x in O) {j=encodeURI(x).replace(/%../g,'i').length;if(j=(R=O[x])*j-j-(R+1)*encodeURI(c).replace(/%../g,'i').length)(j>M||j==M&&R>N)&&(M=j,N=R,e=x);if(j<1)delete O[x]}o={};for(x in O)o[x.split(e).join(c)]=1;O=o;if(!e)break;s=s.split(e).join(c)+c+e}c=s.split('\"').length<s.split(\"'\").length?(B='\"',/\"/g):(B=\"'\",/'/g);i=b.children[6].value='_='+B+s.replace(c,'\\\\'+B)+B+';for(Y in $='+B+m+B+')with(_.split($[Y]))_=join(pop());eval(_)';i=encodeURI(i).replace(/%../g,'i').length;b.children[4].innerHTML=S+'B to '+i+'B ('+(i=i-S)+'B, '+((i/S*1e4|0)/100)+'%)'};setTimeout(\"b.children[1].value=eval(b.children[9].innerHTML.replace(/eval\\\\(_\\\\)/,'_'));L()\");";
    sampleText;

textarea.value = sampleText;

packButton.addEventListener('click', function() {
  var value = textarea.value;

  var ast = UglifyJS.parse(value);
  ast.figure_out_scope();
  var compressor = UglifyJS.Compressor();
  ast = ast.transform(compressor);
  var uglified = ast.print_to_string();

  uglified = uglified.replace(/([\r\n]|^)\s*\/\/.*|[\r\n]+\s*/g,'').replace(/\\/g,'\\\\');

  var compressed = jscrusher.compress(uglified);
  outputContainer.value = compressed;
  document.querySelector('#info').innerHTML = 'Orig ' + encodeURI(textarea.value.replace(/([\r\n]|^)\s*\/\/.*|[\r\n]+\s*/g,'').replace(/\\/g,'\\\\')).replace(/%../g,'i').length + ' output ' + compressed.length + ' - savings ' + (100 - (compressed.length * 100 / textarea.value.length).toFixed(2)) + '%';
});
